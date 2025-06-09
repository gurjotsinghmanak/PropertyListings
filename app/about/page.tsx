import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Home, TrendingUp } from "lucide-react"

export const metadata = {
  title: "About Us - PropertyFinder",
  description: "Learn more about PropertyFinder and our mission to help you find your dream home.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About PropertyFinder</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're passionate about helping people find their perfect home. With years of experience in real estate, we
          make property searching simple and enjoyable.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid gap-8 md:grid-cols-2 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            At PropertyFinder, we believe that finding the right home should be an exciting journey, not a stressful
            ordeal. Our mission is to simplify the property search process by providing comprehensive listings, detailed
            information, and innovative tools that empower buyers to make informed decisions.
          </p>
          <p className="text-muted-foreground">
            We're committed to transparency, accuracy, and exceptional service. Whether you're a first-time buyer or an
            experienced investor, we're here to help you navigate the real estate market with confidence.
          </p>
        </div>
        <div className="relative h-64 md:h-80">
          <Image
            src="/placeholder.svg?height=320&width=480"
            alt="Our mission"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardContent className="p-6 text-center">
            <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">1,000+</div>
            <div className="text-sm text-muted-foreground">Properties Listed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">5,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">10+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="font-semibold mb-1">Sarah Johnson</h3>
              <p className="text-sm text-muted-foreground mb-2">CEO & Founder</p>
              <p className="text-sm">
                With over 15 years in real estate, Sarah founded PropertyFinder to revolutionize how people search for
                homes.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="font-semibold mb-1">Michael Chen</h3>
              <p className="text-sm text-muted-foreground mb-2">Head of Technology</p>
              <p className="text-sm">
                Michael leads our tech team, ensuring our platform provides the best user experience and cutting-edge
                features.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="font-semibold mb-1">Emily Rodriguez</h3>
              <p className="text-sm text-muted-foreground mb-2">Customer Success Manager</p>
              <p className="text-sm">
                Emily ensures every customer has an exceptional experience and finds the perfect property for their
                needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-muted/40 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              Transparency
            </Badge>
            <p className="text-sm text-muted-foreground">
              We believe in honest, clear communication and providing all the information you need to make informed
              decisions.
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              Innovation
            </Badge>
            <p className="text-sm text-muted-foreground">
              We continuously improve our platform with new features and technologies to enhance your property search
              experience.
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" className="mb-3">
              Excellence
            </Badge>
            <p className="text-sm text-muted-foreground">
              We strive for excellence in everything we do, from our property listings to our customer service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
