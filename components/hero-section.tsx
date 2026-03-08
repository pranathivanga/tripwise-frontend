'use client'

import { useEffect, useRef } from 'react'
import { Plane, ChevronDown, MapPin, Compass } from 'lucide-react'

interface HeroSectionProps {
  onPlanTrip: () => void
}

export default function HeroSection({ onPlanTrip }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const PARTICLE_COUNT = 80
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const dx = p.x - mx
        const dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 120
        if (dist < repelRadius && dist > 0) {
          const force = (repelRadius - dist) / repelRadius
          p.x += (dx / dist) * force * 2.5
          p.y += (dy / dist) * force * 2.5
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.15
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      if (mx > 0) {
        particles.forEach(p => {
          const dx = p.x - mx
          const dy = p.y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.4
            ctx.beginPath()
            ctx.moveTo(mx, my)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        })
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    heroRef.current?.addEventListener('mousemove', handleMouseMove)
    heroRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      heroRef.current?.removeEventListener('mousemove', handleMouseMove)
      heroRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #8b5cf6, #3b82f6)' }} />
      <div className="absolute bottom-32 right-20 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, #8b5cf6)' }} />

      {/* Floating tags */}
      <div className="absolute top-24 right-16 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm animate-float text-xs text-white/60 pointer-events-none">
        <MapPin className="w-3 h-3 text-purple-400" /><span>Goa</span>
      </div>
      <div className="absolute top-40 left-12 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-white/60 pointer-events-none"
        style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '1s' }}>
        <MapPin className="w-3 h-3 text-teal-400" /><span>Manali</span>
      </div>
      <div className="absolute bottom-48 left-24 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-white/60 pointer-events-none"
        style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '2s' }}>
        <MapPin className="w-3 h-3 text-pink-400" /><span>Jaipur</span>
      </div>
      <div className="absolute bottom-40 right-28 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs text-white/60 pointer-events-none"
        style={{ animation: 'float 4s ease-in-out infinite', animationDelay: '0.5s' }}>
        <MapPin className="w-3 h-3 text-blue-400" /><span>Kerala</span>
      </div>

      {/* Main content — correct order */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">

        {/* 1. Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8 animate-fade-in">
          <Compass className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-purple-300 font-medium">Smart Budget Travel Planner</span>
        </div>

        {/* 2. Logo + Title */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Plane className="w-10 h-10 text-purple-400"
            style={{ filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.8))' }} />
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            <span className="gradient-text">TripWise</span>
          </h1>
        </div>

        {/* 3. Tagline */}
        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Plan trips your wallet can actually afford.
        </p>
        <p className="text-base text-white/40 max-w-xl mx-auto leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          Intelligent budget breakdowns across 3 travel styles — before you book anything.
        </p>

        {/* 4. Stats */}
        <div className="flex items-center justify-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { value: '3', label: 'Plan Types' },
            { value: '₹', label: 'INR Optimized' },
            { value: '100+', label: 'Cities' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white/80">{stat.value}</div>
              <div className="text-xs text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 5. CTA */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <button
            onClick={onPlanTrip}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777, #0891b2)',
              boxShadow: '0 0 30px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.1)'
            }}
          >
            <Plane className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            <span>Start Planning Your Trip</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40 pointer-events-none">
        <span className="text-xs text-white/50 tracking-widest uppercase">scroll</span>
        <ChevronDown className="w-4 h-4 text-white/50" />
      </div>
    </section>
  )
}