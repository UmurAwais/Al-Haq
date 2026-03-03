import React, { useState } from 'react'
import AnnouncementBar from '../components/AnnouncementBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import FeatureCards from '../components/FeatureCards'
import AboutUs from '../components/AboutUs'
import CourseFeatures from '../components/CourseFeatures'
import FeaturedCourses from '../components/FeaturedCourses'
import Testimonials from '../components/Testimonials'
import ContactForm from '../components/ContactForm'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const section = document.getElementById('courses')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900 scroll-smooth">
      <AnnouncementBar />
      <Header 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onSearchSubmit={handleSearch}
      />
      
      <main className="overflow-hidden">
        {/* Sections */}
        <div className="max-w-375 mx-auto px-4 sm:px-6 lg:px-8" id="home">
          <Hero />
          <FeatureCards />
        </div>

        <AboutUs id="about" />

        <CourseFeatures id="features" />

        <FeaturedCourses 
          id="courses" 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery('')}
        />

        <Testimonials id="testimonials" />

        <ContactForm />

        <CTA />
      </main>

      <Footer />
    </div>
  )
}

export default Home
