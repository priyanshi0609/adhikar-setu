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
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">Adhikar Setu</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                About FRA
              </a>
              <a href="#work" className="text-muted-foreground hover:text-foreground transition-colors">
                Our Work
              </a>
              <a href="#impact" className="text-muted-foreground hover:text-foreground transition-colors">
                Impact
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </nav>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-2 bg-transparent">
                <Github className="h-4 w-4" />
                <span>Star Repo</span>
              </Button>
              <Button size="sm" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Forest Rights Act 2006
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-balance text-foreground">Adhikar Setu</h1>
                <p className="text-xl lg:text-2xl text-muted-foreground text-balance">
                  Bridging Forest Rights with Communities
                </p>
                <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
                  Empowering tribal and forest-dwelling communities through digital transformation of the Forest Rights
                  Act. We're building an AI-powered platform to digitize FRA claims, create interactive atlases, and
                  enable data-driven decision making for sustainable forest governance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Learn About FRA
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
                  See Our Work
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="/tribal-community-in-forest-setting-with-traditiona.jpg"
                alt="Tribal community in forest setting"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About FRA Section */}
      <section id="about" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Understanding the Forest Rights Act</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              The Forest Rights Act (2006) recognizes the rights of forest-dwelling communities to land and resources,
              but implementation faces significant challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Land Rights Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Recognizing Individual Forest Rights (IFR) and Community Rights (CR) for forest-dwelling communities
                  who have been living in forests for generations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Community Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Empowering tribal communities with legal recognition of their traditional rights and sustainable
                  forest resource management practices.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <TreePine className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Sustainable Forests</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Promoting sustainable forest management through Community Forest Resource Rights (CFR) that balance
                  conservation with community needs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We're Doing Section */}
      <section id="work" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Digital Transformation Initiative
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Leveraging AI, satellite data, and modern technology to revolutionize FRA implementation and monitoring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <Database className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Data Digitization & Standardization</h3>
                  <p className="text-muted-foreground">
                    Converting legacy FRA records into standardized digital formats using AI-powered OCR and Named
                    Entity Recognition to extract village names, patta holders, and claim status.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Interactive FRA Atlas</h3>
                  <p className="text-muted-foreground">
                    Creating a comprehensive WebGIS platform with interactive layers showing IFR/CR boundaries, village
                    data, land-use patterns, and real-time progress tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Asset Mapping</h3>
                  <p className="text-muted-foreground">
                    Using satellite imagery and computer vision to map agricultural land, forest cover, water bodies,
                    and infrastructure in FRA villages for better resource planning.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Decision Support System</h3>
                  <p className="text-muted-foreground">
                    Building an intelligent DSS to recommend and layer Central Sector Schemes benefits for FRA patta
                    holders, enabling targeted development interventions.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/digital-map-interface-showing-forest-areas-with-da.jpg"
                alt="Digital FRA Atlas interface"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section id="impact" className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Our Impact & Reach</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Transforming forest governance through technology and community empowerment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Villages Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-lg text-muted-foreground">FRA Claims Digitized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-lg text-muted-foreground">People Reached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">15</div>
              <div className="text-lg text-muted-foreground">States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Stay Updated on FRA Rights & Our Initiatives
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Get the latest updates on forest rights, policy changes, and our technology initiatives delivered to your
              inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email address" className="flex-1" />
              <Button size="lg" className="px-8">
                Subscribe
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <TreePine className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Adhikar Setu</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Bridging forest rights with communities through technology and empowerment.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About FRA
                  </a>
                </li>
                <li>
                  <a href="#work" className="text-muted-foreground hover:text-foreground transition-colors">
                    Our Work
                  </a>
                </li>
                <li>
                  <a href="#impact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Impact
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    FRA Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>contact@adhikarsetu.org</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+91 11 2345 6789</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapIcon className="h-4 w-4" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Adhikar Setu. All Rights Reserved. | Built for empowering tribal communities and sustainable forest
              governance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
