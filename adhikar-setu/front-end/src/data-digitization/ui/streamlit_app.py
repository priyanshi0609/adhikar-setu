import streamlit as st
import requests
import json
import os
from datetime import datetime
import time

# Configuration
API_URL = os.getenv("API_URL", "http://localhost:8000")

st.set_page_config(
    page_title="FRA Document QA",
    page_icon="📄",
    layout="wide"
)

st.title("FRA Document Quality Assurance")
st.write("Review and correct extracted data from FRA documents")

# File upload section
uploaded_file = st.file_uploader("Upload FRA Document", type=["pdf", "jpg", "jpeg", "png"])

if uploaded_file:
    # Send file for processing
    if st.button("Process Document"):
        with st.spinner("Processing document..."):
            try:
                files = {"file": (uploaded_file.name, uploaded_file, uploaded_file.type)}
                response = requests.post(f"{API_URL}/api/v1/parse", files=files)
                
                st.write("DEBUG: response.status_code", response.status_code)
                st.write("DEBUG: response.text", response.text)
                
                data = response.json()
                st.write("DEBUG: response.json()", data)
                
                if response.status_code == 200 and "job_id" in data:
                    job_id = data["job_id"]
                    st.session_state.job_id = job_id
                    st.success("Document processing started!")
                else:
                    st.error(f"Error: {response.text}")
            except Exception as e:
                st.error(f"Request failed: {e}")

# Check job status and display results
if "job_id" in st.session_state:
    job_id = st.session_state.job_id
    with st.spinner("Checking job status..."):
        try:
            completed = False
            for _ in range(20):  # poll up to 20 times (~40 seconds if 2s interval)
                response = requests.get(f"{API_URL}/api/v1/parse/{job_id}")
                if response.status_code != 200:
                    st.error(f"Error checking job status: {response.text}")
                    break

                data = response.json()
                st.write("DEBUG: backend response", data)

                if data.get("status") == "completed":
                    completed = True
                    st.success("Processing completed!")
                    result = data.get("result", {})
                    break
                elif data.get("status") == "failed":
                    st.error(f"Processing failed: {data.get('message', 'Unknown error')}")
                    break
                else:
                    st.info("Document is still being processed...")
                    time.sleep(2)  # wait before polling again

            if not completed:
                st.warning("Processing is taking longer than expected. Please try again later.")
        except Exception as e:
            st.error(f"Failed to fetch job status: {e}")

    # Display extracted fields if available
    if completed and result:
        st.subheader("Extracted Fields")
        
        if "extracted_fields" in result:
            fields = result["extracted_fields"]
            
            # Create form for editing
            with st.form("field_correction_form"):
                col1, col2 = st.columns(2)
                
                with col1:
                    claimant_name = st.text_input(
                        "Claimant Name", 
                        value=fields.get("claimant_name", {}).get("value", "")
                    )
                    guardian_name = st.text_input(
                        "Guardian Name", 
                        value=fields.get("guardian_name", {}).get("value", "")
                    )
                    village = st.text_input(
                        "Village", 
                        value=fields.get("village", {}).get("value", "")
                    )
                    district = st.text_input(
                        "District", 
                        value=fields.get("district", {}).get("value", "")
                    )
                
                with col2:
                    area_ha = st.number_input(
                        "Area (ha)", 
                        value=float(fields.get("area_ha", {}).get("value", 0)) if fields.get("area_ha", {}).get("value") else 0.0
                    )
                    khasra_number = st.text_input(
                        "Khasra Number", 
                        value=fields.get("khasra_number", {}).get("value", "")
                    )
                    claim_type = st.selectbox(
                        "Claim Type",
                        options=["IFR", "CFR", "CR", "Community"],
                        index=0 if not fields.get("claim_type") else ["IFR", "CFR", "CR", "Community"].index(fields.get("claim_type", {}).get("value", "IFR"))
                    )
                
                # Submit corrections
                submitted = st.form_submit_button("Save Corrections")
                
                if submitted:
                    corrected_data = {
                        "claimant_name": claimant_name,
                        "guardian_name": guardian_name,
                        "village": village,
                        "district": district,
                        "area_ha": area_ha,
                        "khasra_number": khasra_number,
                        "claim_type": claim_type,
                        "corrected_at": datetime.now().isoformat(),
                        "original_result": result
                    }
                    
                    os.makedirs("data/corrections", exist_ok=True)
                    with open(f"data/corrections/{job_id}.json", "w") as f:
                        json.dump(corrected_data, f, indent=2)
                    
                    st.success("Corrections saved successfully!")
        
        # Show raw JSON
        with st.expander("View Raw JSON"):
            st.json(result)
