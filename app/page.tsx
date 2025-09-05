import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-lg">🌱</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">LCA Platform</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Life Cycle Assessment</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <Button asChild size="sm" variant="ghost">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">Start</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6 text-xs sm:text-sm">
            Government-Grade Platform
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance mb-4 sm:mb-6 text-foreground leading-tight">
            Sustainable Metallurgy Through
            <span className="text-primary block sm:inline"> Life Cycle Assessment</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-balance mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Empower metallurgists, engineers, and policymakers with data-driven insights for sustainable metal
            production and circular economy initiatives.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Start Assessment <span className="ml-2">→</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 bg-transparent w-full sm:w-auto"
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-balance mb-3 sm:mb-4">
              Comprehensive LCA Solutions
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto px-4">
              Advanced tools for analyzing environmental impact across the entire lifecycle of metals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-primary text-xl">🛡️</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Secure Data Management</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Government-grade security with tamper-proof digital signatures and audit trails
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-secondary text-xl">📊</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Advanced Visualization</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Interactive dashboards with flow diagrams, emissions tracking, and efficiency metrics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-accent text-xl">📋</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Automated Reporting</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Generate comprehensive PDF and JSON reports with digital signatures for compliance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-primary text-xl">♻️</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Circular Economy Focus</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Track recycled content, recyclability metrics, and end-of-life scenarios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-secondary text-xl">🌱</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Environmental Impact</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Comprehensive tracking of CO₂ emissions, water usage, and waste generation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                  <span className="text-accent text-xl">👥</span>
                </div>
                <CardTitle className="text-lg sm:text-xl">Multi-Role Access</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Tailored interfaces for metallurgists, engineers, policymakers, and auditors
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Driving Sustainable Metal Production</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Our platform enables comprehensive Life Cycle Assessment for metals including aluminum, copper, steel,
                and zinc. Make informed decisions based on environmental impact data across extraction, processing,
                manufacturing, use, and end-of-life phases.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">ISO 14040/14044 compliant assessments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Multi-format data import (CSV, Excel, JSON)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Real-time collaboration and audit trails</span>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-4 sm:gap-6 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Uptime</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-secondary">256-bit</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Encryption</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-accent">ISO</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Compliant</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 px-4">
            Ready to Transform Your Metal Production?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
            Join leading metallurgists and engineers in creating a more sustainable future through data-driven LCA.
          </p>
          <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto max-w-sm">
            <Link href="/auth/sign-up">
              Start Your Assessment <span className="ml-2">→</span>
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground">🌱</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">LCA Platform</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Government-grade Life Cycle Assessment for sustainable metallurgy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h4>
              <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <div>Features</div>
                <div>Security</div>
                <div>Compliance</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
              <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <div>Documentation</div>
                <div>API Reference</div>
                <div>Support</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
                <div>Compliance</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
            © 2024 LCA Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
