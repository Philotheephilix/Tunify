"use client";

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Music, Wallet, Shield, Sparkles, FanIcon } from "lucide-react"
import Link from "next/link"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog"
import { useRouter } from "next/navigation";


export default function LandingPage() {
  const router = useRouter(); 
  function handleMode(plan: { name: string; price: string; period: string; features: string[]; featured: boolean }) {
    if (plan.name=='Free'){
      sessionStorage.setItem('User',"Free")
    }
    else{
      sessionStorage.setItem('User','privy')
    }
    router.push('/listen');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Decentralized Music Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Fair Pay for Every Beat, Stream by Stream
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the revolution in music streaming. Direct pay-per-listen model ensuring artists get their fair share
              while listeners enjoy unlimited music.
            </p>
            <div className="flex gap-4 justify-center pt-4">
            <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="ghost" className="w-full justify-start bg-white" asChild>
                    <span className="text-black">
                      <FanIcon className="mr-2 h-4 w-4" />
                      Get Started
                    </span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Choose Your Plan</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="flex gap-6">
                  {pricingPlans.map((plan) => (
                      <Card key={plan.name} className={`p-6 border-primary`} onClick={(e)=>{handleMode(plan)}}>
                        {plan.featured && (
                          <Badge className="mb-4" variant="secondary">
                            Most Popular
                          </Badge>
                        )}
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    ))}
                    </div>
                  <AlertDialogDescription >

                  </AlertDialogDescription>
                </AlertDialogContent>
              </AlertDialog>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose BeatSync</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 bg-card/50 backdrop-blur">
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                {index !== steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20" />
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-primary">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.name} className={`p-6 ${plan.featured ? "border-primary" : ""}`} >
                {plan.featured && (
                  <Badge className="mb-4" variant="secondary">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={plan.featured ? "default" : "outline"}>
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Artists Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10" />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.quote}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">Ready to Transform Your Music Journey?</h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of artists and listeners in the future of music streaming. Fair, transparent, and
            decentralized.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">BeatSync</h3>
              <p className="text-sm text-muted-foreground">
                Revolutionizing music streaming through decentralized technology and fair compensation.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BeatSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Fair Compensation",
    description: "Artists earn directly from each stream, ensuring transparent and immediate payments for their work.",
    icon: Wallet,
  },
  {
    title: "Decentralized Platform",
    description: "Built on blockchain technology, ensuring transparency and eliminating intermediaries.",
    icon: Shield,
  },
  {
    title: "High-Quality Streaming",
    description: "Experience music in studio-quality delivered directly from IPFS storage",
    icon: Music,
  },
]

const steps = [
  {
    title: "Connect Your Wallet",
    description: "Link your digital wallet to start streaming or uploading music.",
  },
  {
    title: "Start Streaming",
    description: "Listen to music while supporting artists directly with each stream.",
  },
]

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["No Wallet connection ", "No Ad's", "Mine Monero in background"],
    featured: false,
  },
  {
    name: "Paid",
    price: "Pay",
    period: "/use",
    features: [
      "Requires Wallet Connection",
      "Direct Pay to Music Artists",
      "No Ad's",
    ],
    featured: true,
  },
]

const testimonials = [
  {
    quote: "Finally, a platform that truly values artists and their work. The pay-per-stream model is revolutionary.",
    name: "Philo Sanjay Chamberline P",
    title: "Web 3 Developer, CEO of Tunify",
  },
  {
    quote: "The transparency in payments and direct connection with fans has transformed how I release my music.",
    name: "Vitalik Buterin",
    title: "ETH GLOBAL",
  },
  {
    quote: "As a listener, I love knowing my money goes directly to supporting the artists I enjoy.",
    name: "My Cat",
    title: "Music Enthusiast",
  },
]
