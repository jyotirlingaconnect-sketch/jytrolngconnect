"use client";

import { motion, Variants } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import LottieAnimation from "@/components/LottieAnimation";
import OmModel from "@/components/OmModel";
import {
  Star,
  ShieldCheck,
  Headset,
  Sparkles,
  Car,
  Wallet,
  Users,
  HeartHandshake,
  Target,
  Eye,
  CheckCircle,
} from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function AboutClient() {
  return (
    <>
      <Navbar />

      <main className="min-h-[100dvh] pt-20 pb-16 overflow-hidden">
        
        {/* Global Ambient Glow */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-white/20 dark:bg-accent-primary/10 rounded-full blur-[120px] mix-blend-overlay" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent-secondary/20 dark:bg-accent-secondary/10 rounded-full blur-[140px] mix-blend-overlay" />
        </div>

        {/* Hero Section */}
        <section className="relative py-12 lg:py-16">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.span
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 dark:border-white/20 bg-white/30 dark:bg-white/10 backdrop-blur-2xl px-4 py-2 text-sm font-semibold text-ink shadow-[0_4px_24px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_24px_rgba(255,255,255,0.05)]"
                >
                  <Sparkles className="w-4 h-4 text-accent-primary" />
                  Premium Pilgrimage Services
                </motion.span>

                <motion.h1
                  variants={fadeUp}
                  className="mt-6 text-5xl lg:text-6xl font-display font-bold text-ink leading-[1.1] tracking-tight"
                >
                  Your Trusted
                  <span className="block mt-2 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent pb-2">
                    Spiritual Partner
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 text-xl text-ink-muted leading-relaxed font-medium max-w-xl"
                >
                  Jyotirling Connect is proudly operated under
                  <strong className="text-ink font-bold"> Aadarsh Property and Construction</strong>,
                  serving devotees with dedication for over
                  <strong className="text-ink font-bold"> 10+ years.</strong>
                  <br />
                  <br />
                  Our mission is to provide comfortable, safe, and memorable
                  pilgrimage experiences while helping you focus entirely on
                  your devotion.
                </motion.p>

                <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-5">
                  <Button size="lg" asChild className="rounded-full px-8 py-6 text-lg font-semibold bg-accent-primary hover:bg-accent-secondary text-white transition-all duration-300 shadow-[0_8px_30px_rgba(166,58,30,0.4)] hover:shadow-[0_12px_40px_rgba(181,127,36,0.5)] hover:-translate-y-1">
                    <Link href="/booking">Book Your Journey</Link>
                  </Button>

                  <Button variant="outline" size="lg" asChild className="rounded-full px-8 py-6 text-lg font-semibold text-ink border-ink/20 hover:bg-ink/5 dark:border-white/20 dark:hover:bg-white/10 dark:text-white transition-all duration-300 backdrop-blur-xl">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Lottie */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="flex justify-center relative"
              >
                {/* Decorative background glow for Lottie */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/40 dark:bg-white/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative rounded-[2.5rem] p-8 md:p-12 overflow-hidden group transition-colors duration-500 bg-transparent">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <OmModel className="w-[380px] h-[380px] max-w-full relative z-10 drop-shadow-2xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-ink/10 dark:via-white/10 to-transparent my-8" />

        {/* About Company */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="rounded-[3rem] border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-2xl p-10 md:p-16 shadow-[0_16px_64px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_64px_rgba(0,0,0,0.4)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent dark:from-white/5 pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none rounded-[3rem]" />
              
              <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
                    Our Legacy of Trust
                  </h2>
                  <p className="text-xl text-ink-muted leading-relaxed font-medium mb-6">
                    Jyotirling Connect is a premium pilgrimage travel service
                    backed by <strong className="text-ink font-bold">Aadarsh Property and Construction</strong>,
                    a trusted organization with over <strong className="text-ink font-bold">10 years of experience</strong>.
                  </p>
                  <p className="text-xl text-ink-muted leading-relaxed font-medium">
                    We have helped thousands of devotees experience peaceful and
                    comfortable journeys to India&apos;s most sacred destinations.
                    By handling all travel arrangements, we allow you to focus
                    entirely on your spiritual experience.
                  </p>
                </div>
                <div className="flex justify-center">
                   <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-[2.5rem] border border-white/50 dark:border-white/10 bg-white/40 dark:bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden group-hover:scale-105 transition-transform duration-700">
                      <Image
                        src="/founder.jpg"
                        alt="Aadarsh Singh Sengar - Founder"
                        width={600}
                        height={800}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Name Overlay */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16 flex flex-col items-center justify-end">
                        <h3 className="text-white font-display text-2xl font-bold tracking-wide text-center">
                          Aadarsh Singh Sengar
                        </h3>
                        <p className="text-white/80 font-medium text-sm mt-1 uppercase tracking-widest text-center">
                          Founder
                        </p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Offerings */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
             <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div variants={fadeUp} className="group rounded-[2.5rem] bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-10 shadow-[0_16px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-16 w-16 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center border border-white/50 dark:border-white/20 mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Star className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold text-ink mb-4">
                  VIP Darshan Experience
                </h3>
                <p className="text-ink-muted leading-relaxed text-xl font-medium">
                  We specialize in securing VIP Darshan for the Mahakaleshwar Temple, Omkareshwar Jyotirlinga, and other prominent spiritual sites. Avoid the crowds and experience a seamless, dignified visit tailored to your schedule.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="group rounded-[2.5rem] bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-10 shadow-[0_16px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-16 w-16 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center border border-white/50 dark:border-white/20 mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Car className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold text-ink mb-4">
                  Luxury & Safe Travel
                </h3>
                <p className="text-ink-muted leading-relaxed text-xl font-medium">
                  Travel in unmatched comfort with our fleet of clean, hygienic, and well-maintained premium vehicles. Our experienced and verified drivers ensure a safe, smooth, and pleasant journey from start to finish.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-ink/10 dark:via-white/10 to-transparent my-8" />

        {/* Why Choose Us */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-6">
                Why Choose Us?
              </h2>
              <p className="text-xl text-ink-muted font-medium leading-relaxed">
                We combine spiritual reverence with luxury hospitality to deliver an unparalleled pilgrimage experience that you will cherish forever.
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { title: "10+ Years Experience", icon: <Star className="w-8 h-8" />, desc: "A decade of trusted service." },
                { title: "VIP Darshan", icon: <Sparkles className="w-8 h-8" />, desc: "Priority temple access." },
                { title: "Verified Drivers", icon: <ShieldCheck className="w-8 h-8" />, desc: "Trained professionals." },
                { title: "24×7 Support", icon: <Headset className="w-8 h-8" />, desc: "Always here for you." },
                { title: "Premium Vehicles", icon: <Car className="w-8 h-8" />, desc: "Clean and comfortable." },
                { title: "Transparent Pricing", icon: <Wallet className="w-8 h-8" />, desc: "No hidden charges." },
                { title: "Family Friendly", icon: <Users className="w-8 h-8" />, desc: "Safe for all ages." },
                { title: "Memorable Journey", icon: <HeartHandshake className="w-8 h-8" />, desc: "Unforgettable devotion." },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  className="group rounded-[2rem] bg-white/20 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-white/40 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:-translate-y-2"
                >
                  <div className="mx-auto w-16 h-16 rounded-full bg-white/60 dark:bg-white/10 border border-white/50 dark:border-white/20 flex items-center justify-center text-accent-primary mb-6 group-hover:scale-110 group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-ink mb-2">
                    {item.title}
                  </h4>
                  <p className="text-base text-ink-muted font-medium">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              <motion.div variants={fadeUp} className="group rounded-[3rem] bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-transparent border border-white/50 dark:border-white/10 p-10 md:p-12 backdrop-blur-3xl shadow-[0_16px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="w-16 h-16 bg-white/60 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/20 mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold text-ink mb-4">Our Mission</h3>
                <p className="text-ink-muted text-lg font-medium leading-relaxed">
                  To provide devotees with the most comfortable, safe, and deeply satisfying pilgrimage experiences by offering premium hospitality, transparent pricing, and unparalleled on-ground support.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="group rounded-[3rem] bg-gradient-to-br from-white/40 to-white/10 dark:from-white/10 dark:to-transparent border border-white/50 dark:border-white/10 p-10 md:p-12 backdrop-blur-3xl shadow-[0_16px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="w-16 h-16 bg-white/60 dark:bg-white/10 rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/20 mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Eye className="w-8 h-8 text-accent-primary" />
                </div>
                <h3 className="text-3xl font-display font-bold text-ink mb-4">Our Vision</h3>
                <p className="text-ink-muted text-lg font-medium leading-relaxed">
                  To be India&apos;s most trusted and preferred spiritual travel partner, setting the gold standard for luxury pilgrimage tours while preserving the sanctity and tradition of every sacred destination.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Customer Commitment */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-[3rem] bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-3xl p-10 md:p-16 text-center shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.4)] relative overflow-hidden"
            >
              <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_0_40px_rgba(255,255,255,0.05)] pointer-events-none rounded-[3rem]" />
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-ink mb-12 relative z-10">
                Our Commitment to You
              </h2>
              <div className="grid md:grid-cols-3 gap-8 text-left relative z-10">
                {[
                  { title: "Safety First", desc: "Every journey is monitored and driven by vetted professionals." },
                  { title: "Absolute Hygiene", desc: "Vehicles are deep-cleaned and sanitized before every trip." },
                  { title: "Customer Delight", desc: "Your peace of mind and comfort are our highest priorities." },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-white/40 dark:bg-white/10 border border-white/50 dark:border-white/20 shadow-lg hover:-translate-y-2 transition-transform duration-300">
                    <CheckCircle className="w-10 h-10 text-accent-primary" />
                    <div>
                      <h4 className="text-xl font-bold text-ink mb-2">{item.title}</h4>
                      <p className="text-base text-ink-muted font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-accent-primary to-accent-secondary p-12 md:p-16 text-center shadow-[0_30px_100px_rgba(166,58,30,0.3)]"
            >
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/20 rounded-full blur-[80px] pointer-events-none" />
              
              <h2 className="relative z-10 text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                Begin Your Sacred Journey
              </h2>
              <p className="relative z-10 text-white/90 max-w-2xl mx-auto text-xl mb-10 leading-relaxed font-medium">
                Allow us to handle the travel intricacies while you focus on seeking divine blessings. Experience premium comfort and VIP care.
              </p>
              
              <Button
                size="lg"
                className="relative z-10 rounded-full px-10 py-7 text-lg font-bold bg-[#2B1710] text-white hover:bg-white/90 hover:text-ink hover:scale-105 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.2)]"
                asChild
              >
                <Link href="/booking">Reserve Your Journey</Link>
              </Button>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
