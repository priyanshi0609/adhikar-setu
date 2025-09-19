import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TreePine,
  Users,
  MapPin,
  Database,
  BarChart3,
  Shield,
  Github,
  LogIn,
  Mail,
  Phone,
  MapIcon,
  ExternalLink,
  FileText,
  CheckCircle,
  Clock,
  Layers,
  Satellite,
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { LoaderOne } from "@/components/ui/loader";
import { useEffect, useState } from "react";

// Import images (you'll need to add these to your assets folder)
import digitalMap from "@/assets/digital-map.jpg";
import tribalCommunity from "@/assets/tribal-community.jpg";
// import fraProcess from "@/assets/fra-process.png";
import stateMap from "@/assets/state-map.png";
// import teamMeeting from "@/assets/team-meeting.jpg";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Simulate loading for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // FAQ data
  const faqItems = [
    {
      question: "What is the Forest Rights Act (FRA), 2006?",
      answer:
        "The Scheduled Tribes and Other Traditional Forest Dwellers (Recognition of Forest Rights) Act, 2006, is a key piece of forest legislation that recognizes the rights of forest-dwelling communities to land and other resources denied to them over decades.",
    },
    {
      question: "Who is eligible to claim rights under FRA?",
      answer:
        "Eligible claimants include: 1) Members of Scheduled Tribes who primarily reside in and depend on forests for bona fide livelihood needs, and 2) Other Traditional Forest Dwellers who have resided in forests for at least three generations (75 years) prior to December 13, 2005.",
    },
    {
      question: "What types of rights are recognized under FRA?",
      answer:
        "FRA recognizes: 1) Individual Forest Rights (IFR) for habitation and cultivation, 2) Community Rights (CR) such as nistar, grazing, fishing, etc., 3) Community Forest Resource Rights (CFRR) to protect, regenerate, conserve, or manage any community forest resource.",
    },
    {
      question: "What is the cut-off date for claiming rights?",
      answer:
        "The claimant must have occupied the forest land before December 13, 2005. For Other Traditional Forest Dwellers, they must also prove three generations (75 years) of residence and dependence on forests prior to this date.",
    },
    {
      question: "How does Adhikar Setu help in FRA implementation?",
      answer:
        "Adhikar Setu digitizes the entire FRA process through an AI-powered platform that includes claim management, geospatial mapping of rights, satellite imagery analysis for evidence verification, and integration with government schemes for post-rights development.",
    },
  ];

  // Features data
  const features = [
    {
      icon: <Database className="h-8 w-8" />,
      title: "Digital Document Management",
      description:
        "AI-powered OCR and NER to extract and standardize FRA claims from legacy records with Rule 13 evidence validation",
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: "Interactive FRA Atlas",
      description:
        "WebGIS platform visualizing IFR, CR, and CFR boundaries with filtering by state, district, and tribal groups",
    },
    {
      icon: <Satellite className="h-8 w-8" />,
      title: "Satellite Evidence Verification",
      description:
        "AI analysis of satellite imagery to verify occupation dates and land use patterns as supplementary evidence",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Decision Support System",
      description:
        "Scheme layering for FRA patta holders with eligibility mapping for CSS programs like PM-KISAN, Jal Jeevan Mission",
    },
  ];

  // Process steps
  const processSteps = [
    {
      step: "1",
      title: "Claim Submission",
      description:
        "Gram Sabha initiates process with Form A/B/C and minimum two Rule 13 evidences",
    },
    {
      step: "2",
      title: "FRC Verification",
      description:
        "Forest Rights Committee conducts site verification with forest/revenue officials",
    },
    {
      step: "3",
      title: "SDLC Review",
      description:
        "Sub-Divisional Level Committee examines claims and prepares draft records",
    },
    {
      step: "4",
      title: "DLC Approval",
      description:
        "District Level Committee gives final approval with Collector's non-delegable signature",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <LoaderOne className="w-16 h-16 text-green-600 animate-spin mb-6" />
        <h1 className="text-3xl font-bold text-green-700 mt-2">Adhikar Setu</h1>
        <p className="text-center text-gray-600 max-w-md">
          Bridging forest communities with their rights through technology
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                Adhikar Setu
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                About FRA
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#process"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Process
              </a>
              <a
                href="#faq"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <a
                href="https://github.com/ArshTiwari2004/adhikar-setu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex items-center space-x-2 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Button>
              </a>

              <Link to="/login">
                <Button
                  size="sm"
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="secondary"
                  className="w-fit bg-green-100 text-green-800 border-green-200"
                >
                  Forest Rights Act 2006 Implementation
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance text-gray-900">
                  Digitizing Forest Rights for Tribal Empowerment
                </h1>
                <p className="text-xl lg:text-2xl text-gray-600 text-balance">
                  AI-powered platform for FRA claim management and monitoring
                </p>
                <p className="text-lg text-gray-600 text-pretty max-w-2xl">
                  Adhikar Setu is an integrated technology solution that
                  streamlines the implementation of the Forest Rights Act, 2006.
                  We're building India's first comprehensive FRA Atlas with
                  AI-powered evidence verification and decision support systems
                  for targeted scheme implementation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="text-lg px-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Get Started
                  </Button>
                </Link>
                <a href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Learn More
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-200 rounded-2xl shadow-2xl w-full h-90 flex items-center justify-center">
                <img
                  src={tribalCommunity}
                  alt="Tribal community meeting"
                  className="w-full h-full  rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-green-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">4</div>
              <div className="text-sm md:text-base">States Covered</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-sm md:text-base">Villages Mapped</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm md:text-base">Claims Processed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10+</div>
              <div className="text-sm md:text-base">
                Govt Schemes Integrated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About FRA Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              About the Forest Rights Act, 2006
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Forest Rights Act recognizes the rights of forest-dwelling
              communities to land and resources
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Right to Land & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  FRA recognizes individual and community forest rights over
                  forest land and resources that forest dwellers have
                  traditionally owned, occupied, or used.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community Forest Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Communities get rights to protect, regenerate, conserve, and
                  manage community forest resources for sustainable use under
                  Section 3(1)(i) of FRA.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TreePine className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Conservation & Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  FRA holders and Gram Sabhas are empowered to protect wildlife,
                  forests, and biodiversity while ensuring sustainable use of
                  resources under Section 5.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-4">
              Key FRA Implementation Challenges
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">
                  Scattered, non-digitized legacy records of IFR, CR, and CFR
                  rights
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">
                  No centralized visual repository of FRA claims and granted
                  titles
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">
                  Difficulty verifying occupation dates and evidence
                  authenticity
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-green-700">
                  Limited integration with development schemes for FRA
                  beneficiaries
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Adhikar Setu Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution addresses key FRA implementation
              challenges
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-green-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                FRA Atlas & WebGIS Integration
              </h3>
              <p className="text-gray-600 mb-6">
                Our interactive FRA Atlas provides a centralized visual
                repository of all forest rights claims and titles, integrated
                with satellite imagery and asset mapping for evidence
                verification and monitoring.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Visualization of IFR, CR, and CFR boundaries
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Satellite-based change detection for occupation verification
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Integration with forest, groundwater, and infrastructure
                    data
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">
                    Role-based access for different stakeholders
                  </span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-200 rounded-2xl shadow-lg w-full h-150 flex items-center justify-center">
              <img
                src={digitalMap}
                alt="Digital map interface"
                className="w-full h-full  rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              FRA Implementation Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamlining the statutory workflow for forest rights recognition
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-1 bg-green-200"></div>

            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="md:flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold z-10 md:absolute md:left-1/2 md:-translate-x-1/2">
                      {step.step}
                    </div>
                    <div
                      className={`ml-10 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-gray-100 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Statutory Workflow Compliance
            </h3>
            <p className="text-gray-600 mb-4">
              Adhikar Setu implements the complete FRA statutory workflow as
              mandated by the Act and Rules:
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  Gram Sabha initiates process and authorizes claims (Form
                  A/B/C)
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  FRC conducts site verification with forest/revenue officials
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  SDLC examines petitions and prepares draft records
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">
                  DLC gives final approval with Collector's non-delegable
                  signature
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Target States Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Initial Implementation States
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Focusing on states with significant tribal populations and forest
              cover
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-2xl shadow-lg w-full h-130 flex items-center justify-center border border-gray-800 shadow-2xl">
              <img
                src={stateMap}
                alt="State map"
                className="w-full h-full  rounded-2xl"
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Madhya Pradesh
                </h3>
                <p className="text-gray-600">
                  Highest tribal population in India with diverse forest
                  ecosystems and significant FRA claims.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tripura
                </h3>
                <p className="text-gray-600">
                  High percentage of tribal population with extensive forest
                  coverage and historical forest dependence.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Odisha
                </h3>
                <p className="text-gray-600">
                  Rich tribal heritage with significant forest areas and complex
                  FRA implementation challenges.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Telangana
                </h3>
                <p className="text-gray-600">
                  Rapid FRA implementation with need for technological support
                  to ensure proper verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about FRA and the Adhikar Setu platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left bg-white hover:bg-gray-50"
                  onClick={() =>
                    setOpenFaqIndex(openFaqIndex === index ? null : index)
                  }
                >
                  <span className="font-semibold text-gray-900">
                    {item.question}
                  </span>
                  {openFaqIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaqIndex === index && (
                  <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform FRA Implementation?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join us in digitizing forest rights recognition and empowering
            tribal communities across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 px-8"
              >
                Get Started
              </Button>
            </Link>
            <a href="#contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-green-700 px-8"
              >
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-400" />
                <span className="text-2xl font-bold">Adhikar Setu</span>
              </div>
              <p className="text-gray-400">
                Bridging forest rights with communities through technology and
                empowerment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About FRA
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#process"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Process
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://tribal.nic.in/FRA.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FRA Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="https://tribal.nic.in/Divisions/FRA/Resources/FRA-Literature.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FRA Documents
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Implementation Manual
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">fra@tribal.gov.in</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">+91 11 2345 6789</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapIcon className="h-4 w-4 text-green-400" />
                  <span className="text-gray-400">
                    Ministry of Tribal Affairs, New Delhi
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2023 Adhikar Setu. Developed for Ministry of Tribal Affairs.
            </p>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              Forest Rights Act, 2006 Implementation Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
