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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Scale,
  FileText,
  Gavel,
} from "lucide-react";
import { useState, useEffect } from "react";
import { colors, colorUtils } from "../colors.js";

// Import local images
import image1 from "@/assets/image_1.jpg";
import image2 from "@/assets/image_2.png";
import image3 from "@/assets/image_3.jpg";
import digitalMap from "@/assets/digital-map.jpg";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Carousel images
  const carouselImages = [
    {
      url: image1,
      alt: "Forest landscape with tribal community",
      title: "Empowering Forest Communities",
    },
    {
      url: image2,
      alt: "Digital mapping technology",
      title: "Digital Transformation",
    },
    {
      url: image3,
      alt: "Tribal community members",
      title: "Community Rights Protection",
    },
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background.primary }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundColor: colorUtils.withOpacity(
            colors.background.primary,
            0.95
          ),
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${colors.border.light}`,
          boxShadow: colors.shadow.sm,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div
                className="p-1.5 rounded-lg"
                style={{
                  background: colors.background.gradient.primary,
                }}
              >
                <TreePine
                  className="h-7 w-7"
                  style={{ color: colors.text.inverse }}
                />
              </div>
              <div>
                <span
                  className="text-xl font-bold"
                  style={{ color: colors.text.primary }}
                >
                  Adhikar Setu
                </span>
                <div
                  className="text-xs font-medium"
                  style={{ color: colors.text.tertiary }}
                >
                  Government of India
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["About FRA", "Our Work", "Impact", "Contact"].map(
                (item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase().replace(" ", "")}`}
                    className="font-medium text-sm tracking-wide transition-colors duration-200"
                    style={{
                      color: colors.text.secondary,
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = colors.primary[600])
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = colors.text.secondary)
                    }
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <a
                href="https://github.com/ArshTiwari2004/adhikar-setu"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200"
                  style={{
                    borderColor: colors.border.medium,
                    color: colors.text.secondary,
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      colors.background.secondary;
                    e.target.style.borderColor = colors.border.dark;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = colors.border.medium;
                  }}
                >
                  <Github className="h-4 w-4 mr-2" />
                  Repository
                </Button>
              </a>
              <Button
                size="sm"
                className="transition-colors duration-200"
                style={{
                  backgroundColor: colors.primary[600],
                  color: colors.text.inverse,
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = colors.primary[700])
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = colors.primary[600])
                }
                onClick={() => (window.location.href = "/login")}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Portal Login
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.background.secondary)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X
                  className="h-6 w-6"
                  style={{ color: colors.text.secondary }}
                />
              ) : (
                <Menu
                  className="h-6 w-6"
                  style={{ color: colors.text.secondary }}
                />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden py-4"
              style={{
                borderTop: `1px solid ${colors.border.light}`,
                backgroundColor: colors.background.primary,
              }}
            >
              <nav className="flex flex-col space-y-4">
                {["About FRA", "Our Work", "Impact", "Contact"].map(
                  (item, index) => (
                    <a
                      key={index}
                      href={`#${item.toLowerCase().replace(" ", "")}`}
                      className="px-2 py-1 font-medium transition-colors"
                      style={{ color: colors.text.secondary }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = colors.primary[600])
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = colors.text.secondary)
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  )
                )}
                <div
                  className="flex flex-col space-y-2 pt-4"
                  style={{ borderTop: `1px solid ${colors.border.light}` }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() =>
                      window.open(
                        "https://github.com/ArshTiwari2004/adhikar-setu",
                        "_blank"
                      )
                    }
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Repository
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
                    style={{
                      backgroundColor: colors.primary[600],
                      color: colors.text.inverse,
                    }}
                    onClick={() => (window.location.href = "/login")}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Portal Login
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <section
        className="py-16 lg:py-20"
        style={{
          background: colors.background.gradient.hero,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-6">
                <Badge
                  variant="secondary"
                  className="w-fit px-3 py-1"
                  style={{
                    backgroundColor: colors.status.success.bg,
                    color: colors.status.success.text,
                    borderColor: colors.status.success.border,
                  }}
                >
                  Forest Rights Act 2006 • Government of India
                </Badge>
                <h1
                  className="text-4xl lg:text-6xl font-bold leading-tight"
                  style={{ color: colors.text.primary }}
                >
                  Adhikar Setu
                </h1>
                <p
                  className="text-xl lg:text-2xl font-medium"
                  style={{ color: colors.primary[700] }}
                >
                  Bridging Forest Rights with Communities
                </p>
                <p
                  className="text-lg leading-relaxed max-w-2xl"
                  style={{ color: colors.text.secondary }}
                >
                  Empowering tribal and forest-dwelling communities through
                  digital transformation of the Forest Rights Act. We're
                  building an AI-powered platform to digitize FRA claims, create
                  interactive atlases, and enable data-driven decision making
                  for sustainable forest governance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 transition-all duration-200"
                  style={{
                    backgroundColor: colors.primary[600],
                    color: colors.text.inverse,
                    boxShadow: colors.shadow.lg,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = colors.primary[700];
                    e.target.style.boxShadow = colors.shadow.xl;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.primary[600];
                    e.target.style.boxShadow = colors.shadow.lg;
                  }}
                  onClick={() =>
                    window.open("https://www.fra.org.in/", "_blank")
                  }
                >
                  Learn About FRA
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 transition-all duration-200"
                  style={{
                    borderWidth: "2px",
                    borderColor: colors.primary[600],
                    color: colors.primary[600],
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = colors.primary[50])
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                  onClick={() => (window.location.href = "/login")}
                >
                  Access Portal
                </Button>
              </div>
            </div>

            {/* Image Carousel */}
            <div className="relative order-1 lg:order-2">
              <div
                className="relative h-80 lg:h-96 rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.neutral[200],
                  boxShadow: colors.shadow["2xl"],
                }}
              >
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-110"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: colors.background.gradient.overlay,
                      }}
                    />
                    <div
                      className="absolute bottom-4 left-4"
                      style={{ color: colors.text.inverse }}
                    >
                      <h3 className="text-lg font-semibold">{image.title}</h3>
                    </div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm transition-colors"
                  style={{
                    backgroundColor: colorUtils.withOpacity(
                      colors.background.primary,
                      0.2
                    ),
                    color: colors.text.inverse,
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = colorUtils.withOpacity(
                      colors.background.primary,
                      0.3
                    ))
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = colorUtils.withOpacity(
                      colors.background.primary,
                      0.2
                    ))
                  }
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full backdrop-blur-sm transition-colors"
                  style={{
                    backgroundColor: colorUtils.withOpacity(
                      colors.background.primary,
                      0.2
                    ),
                    color: colors.text.inverse,
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = colorUtils.withOpacity(
                      colors.background.primary,
                      0.3
                    ))
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = colorUtils.withOpacity(
                      colors.background.primary,
                      0.2
                    ))
                  }
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className="w-3 h-3 rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          index === currentSlide
                            ? colors.text.inverse
                            : colorUtils.withOpacity(colors.text.inverse, 0.5),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About FRA Section */}
      <section
        id="about"
        className="py-16"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Understanding the Forest Rights Act
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              The Forest Rights Act (2006) recognizes the rights of
              forest-dwelling communities to land and resources, but
              implementation faces significant challenges.
            </p>
          </div>

          {/* Sliding Cards Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-8 transition-transform duration-100 ease-out"
              style={{
                transform: `translateX(-${Math.max(
                  0,
                  (scrollY - 400) * 0.8
                )}px)`,
              }}
            >
              {[
                {
                  icon: Shield,
                  title: "Land Rights Recognition",
                  desc: "Recognizing Individual Forest Rights (IFR) and Community Rights (CR) for forest-dwelling communities who have been living in forests for generations.",
                },
                {
                  icon: Users,
                  title: "Community Empowerment",
                  desc: "Empowering tribal communities with legal recognition of their traditional rights and sustainable forest resource management practices.",
                },
                {
                  icon: TreePine,
                  title: "Sustainable Forests",
                  desc: "Promoting sustainable forest management through Community Forest Resource Rights (CFR) that balance conservation with community needs.",
                },
                {
                  icon: Scale,
                  title: "Legal Framework",
                  desc: "Providing a robust legal framework that protects traditional forest dwellers from eviction and ensures their constitutional rights to livelihood and habitat.",
                },
                {
                  icon: FileText,
                  title: "Documentation Process",
                  desc: "Streamlining the complex documentation and claim verification process through digital platforms, making it more accessible and transparent for communities.",
                },
                {
                  icon: Gavel,
                  title: "Dispute Resolution",
                  desc: "Establishing fair and efficient mechanisms for resolving disputes related to forest rights claims and ensuring justice for all stakeholders involved.",
                },
              ].map((card, index) => (
                <div key={index} className="flex-shrink-0 w-80">
                  <Card
                    className="h-full transition-all duration-300 group"
                    style={{
                      borderColor: colors.border.light,
                      backgroundColor: colors.background.card,
                      boxShadow: colors.shadow.base,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = colors.shadow.xl;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = colors.shadow.base;
                    }}
                  >
                    <CardHeader className="pb-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                        style={{ backgroundColor: colors.primary[100] }}
                      >
                        <card.icon
                          className="h-8 w-8 transition-colors duration-300 group-hover:text-white"
                          style={{ color: colors.primary[600] }}
                        />
                      </div>
                      <CardTitle
                        className="text-xl"
                        style={{ color: colors.text.primary }}
                      >
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription
                        className="text-base leading-relaxed"
                        style={{ color: colors.text.secondary }}
                      >
                        {card.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Gradient overlays for smooth edge effect */}
            <div
              className="absolute inset-y-0 left-0 w-32 pointer-events-none z-10"
              style={{
                background: `linear-gradient(to right, ${colors.background.primary}, transparent)`,
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10"
              style={{
                background: `linear-gradient(to left, ${colors.background.primary}, transparent)`,
              }}
            />
          </div>
        </div>
      </section>

      {/* What We're Doing Section */}
      <section
        id="work"
        className="py-16"
        style={{ backgroundColor: colors.background.secondary }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Our Digital Transformation Initiative
            </h2>
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Leveraging AI, satellite data, and modern technology to
              revolutionize FRA implementation and monitoring.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: Database,
                  title: "Data Digitization & Standardization",
                  desc: "Converting legacy FRA records into standardized digital formats using AI-powered OCR and Named Entity Recognition to extract village names, patta holders, and claim status.",
                },
                {
                  icon: MapPin,
                  title: "Interactive FRA Atlas",
                  desc: "Creating a comprehensive WebGIS platform with interactive layers showing IFR/CR boundaries, village data, land-use patterns, and real-time progress tracking.",
                },
                {
                  icon: BarChart3,
                  title: "AI-Powered Asset Mapping",
                  desc: "Using satellite imagery and computer vision to map agricultural land, forest cover, water bodies, and infrastructure in FRA villages for better resource planning.",
                },
                {
                  icon: ExternalLink,
                  title: "Decision Support System",
                  desc: "Building an intelligent DSS to recommend and layer Central Sector Schemes benefits for FRA patta holders, enabling targeted development interventions.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-6 p-6 rounded-xl transition-shadow"
                  style={{
                    backgroundColor: colors.background.card,
                    boxShadow: colors.shadow.sm,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = colors.shadow.md)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = colors.shadow.sm)
                  }
                >
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: colors.background.gradient.primary,
                    }}
                  >
                    <item.icon
                      className="h-7 w-7"
                      style={{ color: colors.text.inverse }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ color: colors.text.primary }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: colors.text.secondary }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div
                className="relative h-full min-h-96 rounded-2xl overflow-hidden"
                style={{ boxShadow: colors.shadow["2xl"] }}
              >
                <img
                  src={digitalMap}
                  alt="Digital FRA Atlas interface"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${colorUtils.withOpacity(
                      colors.primary[900],
                      0.2
                    )}, transparent)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section
        id="impact"
        className="py-16"
        style={{ backgroundColor: colors.background.primary }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: colors.text.primary }}
            >
              Our Impact & Reach
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: colors.text.secondary }}
            >
              Transforming forest governance through technology and community
              empowerment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "50+", label: "Villages Mapped" },
              { number: "100+", label: "FRA Claims Digitized" },
              { number: "100+", label: "People Reached" },
              { number: "4", label: "States Covered" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl transition-shadow"
                style={{
                  background: colors.background.gradient.secondary,
                  boxShadow: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow = colors.shadow.lg)
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <div
                  className="text-4xl lg:text-5xl font-bold mb-2"
                  style={{ color: colors.primary[600] }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-lg font-medium"
                  style={{ color: colors.text.secondary }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section
        className="py-16"
        style={{
          background: colors.background.gradient.primary,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: colors.text.inverse }}
            >
              Stay Updated on FRA Rights & Our Initiatives
            </h2>
            <p className="text-xl mb-8" style={{ color: colors.primary[100] }}>
              Get the latest updates on forest rights, policy changes, and our
              technology initiatives delivered to your inbox.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 focus:border-white"
                style={{
                  backgroundColor: colorUtils.withOpacity(
                    colors.background.primary,
                    0.1
                  ),
                  borderColor: colorUtils.withOpacity(colors.text.inverse, 0.2),
                  color: colors.text.inverse,
                  "::placeholder": { color: colors.primary[100] },
                }}
              />
              <Button
                size="lg"
                className="px-8 font-medium"
                style={{
                  backgroundColor: colors.background.primary,
                  color: colors.primary[600],
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = colors.primary[50])
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = colors.background.primary)
                }
              >
                Subscribe
              </Button>
            </div>

            <p className="text-sm mt-4" style={{ color: colors.primary[100] }}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        style={{
          backgroundColor: colors.neutral[900],
          color: colors.text.inverse,
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: colors.background.gradient.primary,
                  }}
                >
                  <TreePine
                    className="h-6 w-6"
                    style={{ color: colors.text.inverse }}
                  />
                </div>
                <div>
                  <span className="text-xl font-bold">Adhikar Setu</span>
                  <div
                    className="text-xs"
                    style={{ color: colors.neutral[400] }}
                  >
                    Government of India
                  </div>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: colors.neutral[300] }}
              >
                Bridging forest rights with communities through technology and
                empowerment.
              </p>

              {/* Social Links */}
              <div className="flex space-x-3">
                <a
                  href="https://github.com/ArshTiwari2004/adhikar-setu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.neutral[800] }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = colors.neutral[700])
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = colors.neutral[800])
                  }
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="font-semibold mb-6"
                style={{ color: colors.text.inverse }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "About FRA", href: "#about" },
                  { name: "Our Work", href: "#work" },
                  { name: "Impact", href: "#impact" },
                  { name: "Contact", href: "#contact" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="transition-colors"
                      style={{ color: colors.neutral[300] }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = colors.secondary[400])
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = colors.neutral[300])
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3
                className="font-semibold mb-6"
                style={{ color: colors.text.inverse }}
              >
                Resources
              </h3>
              <ul className="space-y-3">
                {[
                  {
                    name: "FRA Guidelines",
                    href: "https://www.fra.org.in/",
                    external: true,
                  },
                  { name: "Documentation", href: "#" },
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="transition-colors"
                      style={{ color: colors.neutral[300] }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = colors.secondary[400])
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = colors.neutral[300])
                      }
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="font-semibold mb-6"
                style={{ color: colors.text.inverse }}
              >
                Contact
              </h3>
              <ul className="space-y-4">
                {[
                  { icon: Mail, text: "arshtiwari12345@gmail.com" },
                  { icon: Phone, text: "+91 11 2345 6789" },
                  { icon: MapIcon, text: "New Delhi, India" },
                ].map((contact, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-3"
                    style={{ color: colors.neutral[300] }}
                  >
                    <contact.icon
                      className="h-5 w-5 mt-0.5"
                      style={{ color: colors.secondary[400] }}
                    />
                    <span>{contact.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between"
            style={{ borderTop: `1px solid ${colors.neutral[800]}` }}
          >
            <p className="text-sm" style={{ color: colors.neutral[400] }}>
              © 2025{" "}
              <span
                className="font-semibold"
                style={{ color: colors.text.inverse }}
              >
                Adhikar Setu
              </span>{" "}
              • Government of India. All Rights Reserved.
            </p>
            <p
              className="mt-4 sm:mt-0 text-sm flex items-center"
              style={{ color: colors.neutral[400] }}
            >
              Built for empowering tribal communities & sustainable forest
              governance
              <span className="ml-2" style={{ color: colors.secondary[400] }}>
                🌱
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
