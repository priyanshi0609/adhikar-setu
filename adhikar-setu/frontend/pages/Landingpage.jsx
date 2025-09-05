import React from "react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-2">
            <img
              src="/fra-logo.png"
              alt="Adhikar-Setu Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold text-gray-700">
              Adhikar-Setu
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6 font-medium text-gray-600">
            <a href="#" className="hover:text-blue-700">Home</a>
            <a href="#" className="hover:text-blue-700">About FRA</a>
            <a href="#" className="hover:text-blue-700">FRA laws and policies</a>
            <a href="#" className="hover:text-blue-700">Resource & Reference</a>
            <a href="#" className="hover:text-blue-700">Gallery</a>
            <a href="#" className="hover:text-blue-700">Contact us</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 p-8">
          {/* Left Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              FRA Atlas & DSS Portal
            </h2>
            <p className="text-gray-600 mb-6">
              Empowering communities by digitizing and mapping Forest Rights Act (2006) claims
            </p>

            <h3 className="font-semibold text-gray-800">What this platform does:</h3>
            <ul className="list-disc ml-5 mb-4 text-gray-700 space-y-1">
              <li>Digitizes legacy FRA claims and integrates them into an FRA Atlas</li>
              <li>Uses AI + Remote Sensing to map land, forests, and water assets</li>
              <li>Provides WebGIS layers for claims, villages, and resources</li>
              <li>Decision Support System (DSS) recommends govt. scheme layering</li>
            </ul>

            <h3 className="font-semibold text-gray-800">Why it matters:</h3>
            <ul className="list-disc ml-5 mb-4 text-gray-700 space-y-1">
              <li>FRA recognizes rights of forest dwellers over land & resources</li>
              <li>But records are scattered, non-digitized, and inaccessible</li>
              <li>This system centralizes claims and supports transparent decisions</li>
            </ul>

            <h3 className="font-semibold text-gray-800">Facts:</h3>
            <ul className="list-disc ml-5 mb-4 text-gray-700 space-y-1">
              <li>FRA enacted in 2006; covers millions of forest-dwelling families</li>
              <li>States: Madhya Pradesh, Odisha, Telangana, Tripura (pilot)</li>
              <li>Titles issued: Individual, Community, and Community Forest Rights</li>
            </ul>

            <p className="text-sm text-gray-500">
              Source: Ministry of Tribal Affairs, FRA Rules 2008 & Amendments
            </p>
          </div>

          {/* Right Login Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Login / Select Role
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Enter User ID / Aadhaar / Gov ID"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password / OTP"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="font-medium text-gray-700">Who are you?</p>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">Claimant</button>
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">FRC</button>
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">SDLC</button>
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">DLC</button>
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">Reviewer</button>
                <button type="button" className="bg-blue-500 text-white rounded-lg py-2">SLMC/MoTA</button>
                <button type="button" className="col-span-3 bg-blue-500 text-white rounded-lg py-2">Public/NGO</button>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-3 mt-4 hover:bg-blue-700">
                Login / Continue
              </button>
              <p className="text-xs text-gray-500 text-center">
                Role determines dashboard & access (Full / Partial / View)
              </p>
            </form>
          </div>
        </section>

        {/* FRA Act Section */}
        <section className="max-w-5xl mx-auto bg-white shadow rounded-lg p-8 my-8">
          <h2 className="text-2xl font-bold mb-4">Forest Rights Act</h2>
          <p className="text-gray-700 leading-relaxed">
            The Forest Rights Act (FRA) 2006 is a milestone in the legislative history of independent India. 
            The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006 
            is a result of the protracted struggle by the marginal and tribal communities of our country to assert 
            their rights over the forestland over which they were traditionally dependent. This Act is crucial to 
            the rights of millions of tribals and other forest dwellers in different parts of our country as it 
            provides for the restitution of deprived forest rights across India, including both individual rights 
            to cultivated land in forestland and community rights over common property resources.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            This is due to its mandate to ‘undo the historical injustice’ done to millions of forest-dwelling tribal 
            and other communities whose pre-existing rights were not recognized during the consolidation of state forests.
          </p>
        </section>

        {/* Newsletter Section */}
        <section className="bg-blue-50 py-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Subscribe to our Newsletter
            </h2>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg border w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2025 Adhikar-Setu. All Rights Reserved.</p>
          <p className="text-gray-400 mt-1">
            Ministry of Tribal Affairs, Government of India
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
