import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle, 
  BarChart3, 
  Clock, 
  Shield, 
  Zap,
  Star,
  PlayCircle,
  Sparkles,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const features = [
    {
      icon: Users,
      title: 'Client Management',
      description: 'Store all client details, track project history, and never lose client information again.',
      color: 'emerald',
    },
    {
      icon: FileText,
      title: 'Professional Invoicing',
      description: 'Create beautiful invoices in 3 steps. Auto-generate unique invoice numbers.',
      color: 'blue',
    },
    {
      icon: CreditCard,
      title: 'Fast Payments',
      description: 'Integrated with Paystack. Your clients pay instantly with card or bank transfer.',
      color: 'purple',
    },
    {
      icon: BarChart3,
      title: 'Revenue Analytics',
      description: 'Track your earnings, pending invoices, and business growth at a glance.',
      color: 'amber',
    },
    {
      icon: Clock,
      title: 'Project Tracking',
      description: 'Track billable hours and project progress with ease.',
      color: 'rose',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with JWT authentication and encrypted data.',
      color: 'indigo',
    },
  ];

  const testimonials = [
    {
      name: 'Chioma Okafor',
      role: 'Freelance UI/UX Designer',
      quote: 'SoloHub has completely transformed how I run my freelance business. I went from chasing payments to getting paid before I even finish projects!',
      rating: 5,
      initial: 'C',
    },
    {
      name: 'Tunde Adebayo',
      role: 'Web Developer & Consultant',
      quote: 'The invoice wizard is a game-changer. I can send professional invoices in under 30 seconds. My clients love the Paystack integration.',
      rating: 5,
      initial: 'T',
    },
    {
      name: 'Sarah Mensah',
      role: 'Content Strategist',
      quote: 'Finally, a tool built for African freelancers! The local payment integration and NGN support make it perfect for my business.',
      rating: 5,
      initial: 'S',
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Freelancers', icon: Users },
    { number: '₦5B+', label: 'Invoices Processed', icon: CreditCard },
    { number: '50+', label: 'Countries', icon: Globe },
    { number: '4.9/5', label: 'User Rating', icon: Star },
  ];

  const getIconBg = (color) => {
    const colors = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      indigo: 'bg-indigo-500',
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900">SoloHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-emerald-50/80 via-white to-blue-50/50 py-16 lg:py-24">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-emerald-100/30 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-200/50">
                <Sparkles className="h-4 w-4" />
                Built for African Freelancers 🇳🇬
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Your Freelance Business
                <span className="block text-emerald-600">Command Center</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-lg mb-8">
                Manage clients, track projects, send professional invoices, and get paid faster. 
                Stop juggling tools — everything you need in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg shadow-xl shadow-emerald-200 hover:shadow-2xl hover:shadow-emerald-300 transition-all">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-6 text-lg border-slate-300 hover:border-emerald-300 hover:bg-emerald-50">
                  <PlayCircle className="h-5 w-5 mr-2 text-emerald-600" />
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Free for 30 days. No credit card required.
              </p>
            </div>
            
            {/* Dashboard Mockup */}
            <div className="relative lg:pl-4">
              <div className="absolute -inset-5 rounded-4xl bg-emerald-200/40 blur-3xl"></div>
              <div className="relative overflow-hidden rounded-2xl border-8 border-slate-900 bg-slate-900 shadow-2xl shadow-emerald-200/50">
                <img
                  src="/mockup.jpeg"
                  alt="SoloHub dashboard showing revenue, projects, invoices, and clients"
                  className="block aspect-square w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3 shadow-xl">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
                <span className="text-sm font-semibold text-slate-700">Your business, in sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform mb-3">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-slate-900">{stat.number}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Features
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Run Your Freelance Business
            </h2>
            <p className="text-lg text-slate-600">
              Stop juggling multiple tools. SoloHub combines everything in one beautiful platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const iconBg = getIconBg(feature.color);
              return (
                <div 
                  key={index} 
                  className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300"
                >
                  <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100/80 text-amber-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              Trusted by Freelancers
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
              What Our Users Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-700/20 opacity-30"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Freelance Business?
          </h2>
          <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
            Join thousands of African freelancers who are already using SoloHub to manage their business.
          </p>
          <Link to="/register">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 px-8 py-6 text-lg shadow-xl shadow-emerald-700/30 hover:shadow-2xl hover:shadow-emerald-700/40 transition-all">
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-emerald-200/80 mt-4">No credit card required. Free for 30 days.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold">SoloHub</span>
              </div>
              <p className="text-sm text-slate-400">Built for African freelancers, by African freelancers.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition cursor-pointer">Features</li>
                <li className="hover:text-white transition cursor-pointer">Pricing</li>
                <li className="hover:text-white transition cursor-pointer">Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition cursor-pointer">About</li>
                <li className="hover:text-white transition cursor-pointer">Blog</li>
                <li className="hover:text-white transition cursor-pointer">Careers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-white transition cursor-pointer">Help Center</li>
                <li className="hover:text-white transition cursor-pointer">Contact</li>
                <li className="hover:text-white transition cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} SoloHub. Made with ❤️ in Nigeria
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;