import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Twitter,
  Linkedin
  
} from "lucide-react"
import digitalMap from "@/assets/digital-map.jpg";
import tribalCommunity from "@/assets/tribal-community.png";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 -mt-12">


        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">Adhikar Setu</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About FRA
              </a>
              <a href="#work" className="text-gray-600 hover:text-gray-900 transition-colors">
                Our Work
              </a>
              <a href="#impact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Impact
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
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
              <span>Star Repo</span>
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
      <section className="py-20 lg:py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit bg-green-100 text-green-800 border-green-200">
                  Forest Rights Act 2006
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance text-gray-900">Adhikar Setu</h1>
                <p className="text-xl lg:text-2xl text-gray-600 text-balance">
                  Bridging Forest Rights with Communities
                </p>
                <p className="text-lg text-gray-600 text-pretty max-w-2xl">
                  Empowering tribal and forest-dwelling communities through digital transformation of the Forest Rights
                  Act. We're building an AI-powered platform to digitize FRA claims, create interactive atlases, and
                  enable data-driven decision making for sustainable forest governance.
                </p>
              </div>

                <div className="flex flex-col sm:flex-row gap-4">
                <Link to="https://www.fra.org.in/">
                  <Button
                  size="lg"
                  className="text-lg px-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                  Learn About FRA
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                  Get Started
                  </Button>
                </Link>
                </div>

            </div>

            <div className="relative">
              <img
                src={tribalCommunity}
                alt="Tribal community in forest setting"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About FRA Section */}
      <section id="about" className="py-10 bg-white">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Understanding the Forest Rights Act</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              The Forest Rights Act (2006) recognizes the rights of forest-dwelling communities to land and resources,
              but implementation faces significant challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-gray-900">Land Rights Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Recognizing Individual Forest Rights (IFR) and Community Rights (CR) for forest-dwelling communities
                  who have been living in forests for generations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-gray-900">Community Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Empowering tribal communities with legal recognition of their traditional rights and sustainable
                  forest resource management practices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <TreePine className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle className="text-gray-900">Sustainable Forests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600">
                  Promoting sustainable forest management through Community Forest Resource Rights (CFR) that balance
                  conservation with community needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We're Doing Section */}
      <section id="work" className="py-20 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Digital Transformation Initiative</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
              Leveraging AI, satellite data, and modern technology to revolutionize FRA implementation and monitoring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Digitization & Standardization</h3>
                  <p className="text-gray-600">
                    Converting legacy FRA records into standardized digital formats using AI-powered OCR and Named
                    Entity Recognition to extract village names, patta holders, and claim status.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive FRA Atlas</h3>
                  <p className="text-gray-600">
                    Creating a comprehensive WebGIS platform with interactive layers showing IFR/CR boundaries, village
                    data, land-use patterns, and real-time progress tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Asset Mapping</h3>
                  <p className="text-gray-600">
                    Using satellite imagery and computer vision to map agricultural land, forest cover, water bodies,
                    and infrastructure in FRA villages for better resource planning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Decision Support System</h3>
                  <p className="text-gray-600">
                    Building an intelligent DSS to recommend and layer Central Sector Schemes benefits for FRA patta
                    holders, enabling targeted development interventions.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
                <img
                 src={digitalMap}
                 alt="Digital FRA Atlas interface"
                 className="rounded-2xl shadow-2xl w-full h-auto"
                   />
            </div>

          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Impact & Reach</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-balance">
              Transforming forest governance through technology and community empowerment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-lg text-gray-600">Villages Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-lg text-gray-600">FRA Claims Digitized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-lg text-gray-600">People Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">4</div>
              <div className="text-lg text-gray-600">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Stay Updated on FRA Rights & Our Initiatives
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-balance">
              Get the latest updates on forest rights, policy changes, and our technology initiatives delivered to your
              inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email address" className="flex-1 border-gray-300 bg-white" />
              <Button size="lg" className="px-8 bg-green-600 hover:bg-green-700 text-white">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
     <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-300">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid md:grid-cols-4 gap-8">
      {/* Brand Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-lg">
            <TreePine className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Adhikar Setu
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">
          Bridging forest rights with communities through technology and empowerment.
        </p>

        {/* Social Links */}
        <div className="flex space-x-3 pt-2">
          <a href="https://github.com/ArshTiwari2004/adhikar-setu" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-500 transition-all duration-300">
            <Github className="h-5 w-5" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 transition-all duration-300">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
             className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-emerald-500">
          Quick Links
        </h3>
        <ul className="space-y-3">
          <li><a href="#about" className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"><span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>About FRA</a></li>
          <li><a href="#work" className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"><span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>Our Work</a></li>
          <li><a href="#impact" className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"><span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>Impact</a></li>
          <li><a href="#contact" className="text-gray-600 hover:text-green-600 transition-colors flex items-center group"><span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>Contact</a></li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-emerald-500">
          Resources
        </h3>
        <ul className="space-y-3">
          <li>
            <a href="https://www.fra.org.in/" target="_blank" rel="noopener noreferrer"
               className="text-gray-600 hover:text-green-600 transition-colors flex items-center group">
              <span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>
              FRA Guidelines
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors flex items-center group">
              <span className="w-2 h-2 bg-green-200 rounded-full mr-2 group-hover:bg-green-600 transition-colors"></span>
              Documentation
            </a>
          </li>
          
          
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4 text-lg relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-green-600 after:to-emerald-500">
          Contact
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start space-x-3 text-gray-600">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
              <Mail className="h-4 w-4 text-green-600" />
            </div>
            <span>arshtiwari12345@gmail.com</span>
          </li>
          <li className="flex items-start space-x-3 text-gray-600">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <span>+91 11 2345 6789</span>
          </li>
          <li className="flex items-start space-x-3 text-gray-600">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
              <MapIcon className="h-4 w-4 text-green-600" />
            </div>
            <span>New Delhi, India</span>
          </li>
        </ul>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="border-t border-gray-300 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between">
      <p className="text-gray-600 text-sm">
        © 2025 <span className="font-semibold text-gray-900">Adhikar Setu</span>. All Rights Reserved.
      </p>
      <p className="mt-4 sm:mt-0 text-sm text-gray-600 flex items-center">
        Built for empowering tribal communities & sustainable forest governance 
        <span className="ml-2 text-green-600">🌱</span>
      </p>
    </div>
  </div>
</footer>

    </div>
  )
}
