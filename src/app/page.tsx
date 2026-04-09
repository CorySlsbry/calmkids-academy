"use client"

import { useState, useEffect } from "react"
import Script from "next/script"
import { Download, Star, CheckCircle2, XCircle, Shield, Zap, Heart, Gift, Lock, Smartphone, ArrowRight, MessageCircle, ChevronRight, Clock, Users, BookOpen, Award } from "lucide-react"

export default function CalmKidsAcademyPage() {
  const [showBottomBar, setShowBottomBar] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState("install")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState("")
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
    }

    const handleScroll = () => {
      setShowBottomBar(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)

    const handleInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleInstallPrompt)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt()
      installPrompt.userChoice.then((choiceResult) => {
        setInstallPrompt(null)
      })
    } else {
      setShowModal(true)
    }
  }

  const handleModalSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")
    
    const formData = new FormData(e.target)
    const email = formData.get('email')
    const friend1 = formData.get('friend_email_1')
    const friend2 = formData.get('friend_email_2')
    
    const payload = {
      email,
      campaign_slug: 'calmkids-academy',
      brand: 'CalmKids Academy',
      ...(friend1 && friend2 ? { friend_email_1: friend1, friend_email_2: friend2 } : {})
    }

    try {
      const response = await fetch('https://jarvis-platform-sigma.vercel.app/api/public/referral/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (friend1 && friend2 && result.discount_code) {
          setSubmitSuccess(`Your code: ${result.discount_code} — emailed to all three of you`)
          setTimeout(() => setShowModal(false), 5000)
        } else {
          setSubmitSuccess("Check your email for the download link")
          setTimeout(() => setShowModal(false), 2000)
        }
      } else {
        setSubmitError("Something went wrong. Please try again.")
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.")
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "MobileApplication",
                "name": "CalmKids Academy",
                "operatingSystem": "Android",
                "applicationCategory": "Educational",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "10000"
                },
                "offers": {
                  "@type": "Offer",
                  "price": "4.99",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "Organization",
                "name": "CalmKids Academy",
                "parentOrganization": {
                  "@type": "Organization",
                  "name": "Salisbury Bookkeeping"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Why is CalmKids Academy different from ABCmouse?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We focus on calm, low-stimulation learning without distracting ticket economies or virtual shopping. Plus, you can cancel with 1 tap directly in the app."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 h-14">
        <div className="flex items-center justify-between px-4 h-full max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">CalmKids Academy</span>
          </div>
          <button 
            onClick={handleInstallClick}
            className="px-4 py-2 bg-[#FF9F43] text-white rounded-lg text-sm font-medium hover:bg-orange-500 transition-colors"
          >
            Install
          </button>
        </div>
      </nav>

      <main className="pt-14">
        <section className="py-16 px-4">
          <div className="max-w-md mx-auto text-center md:max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
              Give your child a 2-grade-level reading advantage in 15 minutes a day
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Zero tantrums, zero ads, and zero hidden fees. Finally, calm educational screen time that actually works.
            </p>
            
            <div className="space-y-3 mb-8">
              <button 
                onClick={handleInstallClick}
                className="w-full bg-[#FF9F43] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Start Free Trial
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="w-full border-2 border-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-300 transition-colors"
              >
                See Why Parents Switch
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9</span>
              </div>
              <span>•</span>
              <span>10,000+ installs</span>
              <span>•</span>
              <span>0 ads, ever</span>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What the other apps get wrong</h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Subscription Trap</h3>
                    <p className="text-sm text-gray-600 mb-3">"There is literally no cancel button in the app. Total scam."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>We fixed this:</strong> 1-tap Google Play cancellation directly in your parent dashboard
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Laggy & Buggy on Tablets</h3>
                    <p className="text-sm text-gray-600 mb-3">"Takes 5 minutes to load. Freezes constantly, causing meltdowns."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>We fixed this:</strong> Lightning-fast native Android app optimized for $50 tablets
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 md:col-span-2 lg:col-span-1">
                <div className="flex items-start gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Distracting Ticket Economy</h3>
                    <p className="text-sm text-gray-600 mb-3">"My kid doesn't learn. They just click randomly to get tickets."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    <strong>We fixed this:</strong> Story-based progression with zero virtual currencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Here's everything you get</h2>
            <p className="text-center text-gray-600 mb-12">If you bought each component separately:</p>
            
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#FF9F43]" />
                  <span>Phonics mastery system</span>
                </div>
                <span className="text-gray-500">$39</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#FF9F43]" />
                  <span>Math fluency games</span>
                </div>
                <span className="text-gray-500">$29</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#FF9F43]" />
                  <span>Parent progress dashboard</span>
                </div>
                <span className="text-gray-500">$19</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-[#FF9F43]" />
                  <span>Calm, ad-free environment</span>
                </div>
                <span className="text-gray-500">$49</span>
              </div>
            </div>

            <div className="text-center border-2 border-[#FF9F43] rounded-xl p-6">
              <div className="text-2xl text-gray-400 line-through mb-2">Total: $136</div>
              <div className="text-3xl font-bold text-[#FF9F43] mb-2">Your Price: $4.99/mo</div>
              <div className="text-gray-600">14-day free trial • Cancel anytime</div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Built different from the ground up</h2>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Loads in under 2 seconds on any Android tablet, even $50 Amazon Fire devices.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Montessori-Inspired</h3>
                <p className="text-gray-600">Low-stimulation UI designed to prevent dopamine crashes and screen-time tantrums.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Transparent Billing</h3>
                <p className="text-gray-600">Cancel with one tap through Google Play. No phone calls or hidden hoops.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Story-Based Learning</h3>
                <p className="text-gray-600">Unlock adventures through reading progress, not virtual shopping or coin collecting.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real Progress Tracking</h3>
                <p className="text-gray-600">Detailed parent dashboard showing exactly which skills your child mastered today.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF9F43] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Zero Data Collection</h3>
                <p className="text-gray-600">All learning data stays on your device. We don't track, sell, or share anything.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">How it works</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#FF9F43] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Download and start trial</h3>
                  <p className="text-gray-600">14 days completely free, no credit card required.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#FF9F43] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">15 minutes daily</h3>
                  <p className="text-gray-600">Your child progresses through calm, story-based lessons.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-[#FF9F43] rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Track real progress</h3>
                  <p className="text-gray-600">Get detailed reports on reading and math skill development.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">See it in action</h2>
            
            <div className="max-w-sm mx-auto">
              <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-16 flex items-center justify-center text-white font-semibold">
                    CalmKids Academy
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm text-blue-600 mb-1">Today's Story</div>
                      <div className="font-semibold">The Magical Garden</div>
                      <div className="text-sm text-gray-600">Chapter 3 of 8 unlocked</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-green-700">Reading</div>
                        <div className="text-sm text-green-600">Level 2.4</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="font-semibold text-purple-700">Math</div>
                        <div className="text-sm text-purple-600">Level 1.8</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-100 flex">
                    <div className="flex-1 py-3 text-center text-[#FF9F43] font-medium">Stories</div>
                    <div className="flex-1 py-3 text-center text-gray-400">Games</div>
                    <div className="flex-1 py-3 text-center text-gray-400">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">CalmKids vs. the rest</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 border-b border-gray-200">Feature</th>
                    <th className="text-center p-4 border-b border-gray-200 bg-[#FF9F43]/10">CalmKids</th>
                    <th className="text-center p-4 border-b border-gray-200">ABCmouse</th>
                    <th className="text-center p-4 border-b border-gray-200">Kiddopia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-gray-200 font-medium">Monthly Price</td>
                    <td className="text-center p-4 border-b border-gray-200 bg-[#FF9F43]/10">$4.99</td>
                    <td className="text-center p-4 border-b border-gray-200">$12.99</td>
                    <td className="text-center p-4 border-b border-gray-200">$8.99</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200 font-medium">Easy Cancellation</td>
                    <td className="text-center p-4 border-b border-gray-200 bg-[#FF9F43]/10"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4 border-b border-gray-200"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4 border-b border-gray-200"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200 font-medium">Fast on Cheap Tablets</td>
                    <td className="text-center p-4 border-b border-gray-200 bg-[#FF9F43]/10"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4 border-b border-gray-200"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4 border-b border-gray-200"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">No Virtual Shopping</td>
                    <td className="text-center p-4 bg-[#FF9F43]/10"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="text-center p-4"><XCircle className="w-5 h-5 text-red-500 mx-auto" /></td>
                    <td className="text-center p-4"><CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What parents are saying</h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Finally ditched ABCmouse after 6 months of frustration. My daughter actually learns here instead of just clicking for tickets. The cancellation was literally one tap through Google Play."</p>
                <div className="text-sm text-gray-600">Sarah M. • Phoenix, AZ</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"Works perfectly on my son's $60 Amazon Fire tablet. ABCmouse took forever to load and would freeze constantly. This loads instantly and he can actually use it."</p>
                <div className="text-sm text-gray-600">Mike R. • Austin, TX</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"No more screen time meltdowns! The calm interface means my 4-year-old doesn't get overstimulated. When 15 minutes is up, she actually stops willingly."</p>
                <div className="text-sm text-gray-600">Jessica L. • Denver, CO</div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"The parent dashboard is incredible. I can see exactly which phonics sounds she mastered today. Kiddopia never showed me anything useful about her actual progress."</p>
                <div className="text-sm text-gray-600">David H. • Seattle, WA</div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="border-2 border-[#FF9F43] rounded-2xl p-8 bg-orange-50">
              <Shield className="w-16 h-16 text-[#FF9F43] mx-auto mb-6" />
              <h2 className="text-2xl font-bold mb-4">Our 14-day guarantee</h2>
              <p className="text-lg text-gray-700 mb-6">
                Try CalmKids Academy completely free for 14 days. If your child doesn't show measurable reading improvement, or if you're not thrilled with the calm, ad-free experience, cancel with one tap directly through Google Play. No phone calls, no hoops, no hard feelings.
              </p>
              <p className="text-sm text-gray-600">
                Your data never leaves your device. No subscriptions unless you love it.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Simple, honest pricing</h2>
            <p className="text-center text-gray-600 mb-12">No hidden fees. No confusing tiers. Cancel anytime.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Free Trial</h3>
                <div className="text-3xl font-bold mb-4">$0<span className="text-sm text-gray-500">/14 days</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Full app access</li>
                  <li>• All stories & games</li>
                  <li>• Parent dashboard</li>
                  <li>• No credit card needed</li>
                </ul>
                <button onClick={handleInstallClick} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">Start Free</button>
              </div>

              <div className="bg-white p-6 rounded-xl border-2 border-[#FF9F43] relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#FF9F43] text-white px-3 py-1 rounded-full text-xs font-medium">MOST POPULAR</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Standard</h3>
                <div className="text-3xl font-bold mb-4">$4.99<span className="text-sm text-gray-500">/month</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Everything in trial</li>
                  <li>• Unlimited access</li>
                  <li>• Monthly progress reports</li>
                  <li>• 1-tap cancellation</li>
                </ul>
                <button onClick={handleInstallClick} className="w-full bg-[#FF9F43] text-white py-3 rounded-lg font-medium hover:bg-orange-500 transition-colors">Subscribe</button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Family</h3>
                <div className="text-3xl font-bold mb-4">$9.99<span className="text-sm text-gray-500">/month</span></div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• Up to 4 children</li>
                  <li>• Individual progress tracking</li>
                  <li>• Sibling achievement sharing</li>
                  <li>• Priority support</li>
                </ul>
                <button onClick={handleInstallClick} className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">Choose Family</button>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-2">Founder's Concierge</h3>
                <div className="text-3xl font-bold mb-4">$499<span className="text-sm opacity-80">/setup + $49/mo</span></div>
                <ul className="space-y-2 text-sm opacity-90 mb-6">
                  <li>• 1:1 onboarding call</li>
                  <li>• Custom learning plan</li>
                  <li>• Direct founder access</li>
                  <li>• Roadmap influence</li>
                  <li>• White-glove setup</li>
                </ul>
                <button onClick={handleInstallClick} className="w-full bg-white text-purple-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Get VIP Access</button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Why is CalmKids Academy different from ABCmouse?</h3>
                <p className="text-gray-600">We focus on calm, low-stimulation learning without distracting ticket economies or virtual shopping. Plus, you can cancel with 1 tap directly in the app through Google Play, no phone calls required.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Will this work on my child's cheap Android tablet?</h3>
                <p className="text-gray-600">Yes! We built CalmKids Academy specifically to run lightning-fast on budget Android tablets like Amazon Fire and basic Samsung devices. It loads in under 2 seconds and never freezes.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Is my child's data private and secure?</h3>
                <p className="text-gray-600">Absolutely. All learning progress stays on your device. We don't collect, track, or share any personal information. Your child's educational journey remains completely private.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">What if my child doesn't like it?</h3>
                <p className="text-gray-600">Try it free for 14 days with no credit card required. If it's not a perfect fit, cancel with one tap through Google Play. No customer service calls, no retention tactics.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">How is this better than free apps like PBS Kids?</h3>
                <p className="text-gray-600">While PBS Kids is great, it lacks structured progression tracking and can have inappropriate ads. CalmKids Academy provides a curated, ad-free learning path with detailed parent insights into skill development.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Will my child have screen time tantrums?</h3>
                <p className="text-gray-600">Our Montessori-inspired, low-stimulation design prevents dopamine spikes and crashes. Most parents report their children willingly stop after their 15-minute session ends.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Can I track my child's actual learning progress?</h3>
                <p className="text-gray-600">Yes! The parent dashboard shows exactly which phonics sounds, sight words, and math concepts your child mastered each day, with detailed progress reports you can't get from other apps.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">What ages is this appropriate for?</h3>
                <p className="text-gray-600">CalmKids Academy is designed for children aged 2-8, with adaptive content that grows with your child from basic letter recognition through 3rd-grade reading comprehension and math skills.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-[#FF9F43]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Give your child the reading advantage they deserve
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join 10,000+ parents who switched to calm, effective screen time
            </p>
            
            <button 
              onClick={handleInstallClick}
              className="w-full max-w-sm bg-white text-[#FF9F43] py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors mx-auto block mb-4"
            >
              Start 14-Day Free Trial
            </button>
            
            <button 
              onClick={() => window.open('https://calmkidsacademy.com/web', '_blank')}
              className="text-orange-100 hover:text-white transition-colors underline"
            >
              Try web version first
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF9F43] rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">CalmKids Academy</span>
            </div>
            
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2024 CalmKids Academy. Powered by Salisbury Bookkeeping.</p>
          </div>
        </div>
      </footer>

      {showBottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <button 
            onClick={handleInstallClick}
            className="w-full bg-[#FF9F43] text-white py-3 px-6 rounded-xl font-semibold hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install CalmKids Academy
          </button>
        </div>
      )}

      {showModal && (
        <dialog open className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm md:max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Get CalmKids Academy</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setModalTab("install")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${modalTab === "install" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                Install free
              </button>
              <button 
                onClick={() => setModalTab("referral")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${modalTab === "referral" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                Refer 2 for 20% off
              </button>
            </div>

            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {modalTab === "install" ? (
                <>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF9F43] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send me the download link"}
                  </button>
                  <p className="text-xs text-gray-500 text-center">No card. Unsubscribe any time.</p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">Share with 2 friends and all three of you get 20% off — instantly.</p>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent"
                  />
                  <input 
                    type="email" 
                    name="friend_email_1" 
                    placeholder="Friend's email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent"
                  />
                  <input 
                    type="email" 
                    name="friend_email_2" 
                    placeholder="Another friend's email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF9F43] focus:border-transparent"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF9F43] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Unlock my 20% off code"}
                  </button>
                </>
              )}

              {submitError && (
                <p className="text-sm text-red-600 text-center">{submitError}</p>
              )}
            </form>
          </div>
        </dialog>
      )}
    </div>
  )
}