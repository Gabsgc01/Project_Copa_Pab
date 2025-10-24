import ProfileIcon from "@/components/ProfileIcon"
import HeroSection from "@/components/homepage/HeroSection"
import IntroductionSection from "@/components/homepage/IntroductionSection"
import LastEditionsSection from "@/components/homepage/LastEditionsSection"
import AboutSection from "@/components/homepage/AboutSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <ProfileIcon />
      <HeroSection />
      <IntroductionSection />
      <LastEditionsSection />
      <AboutSection />
      <Footer />
    </>
  )
}
