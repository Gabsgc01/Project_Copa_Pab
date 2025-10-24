import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import bgHomepageDesktop from "@/assets/imgs/homepage/colagem-homepage-desktop.png"
import bgHomepageTablet from "@/assets/imgs/homepage/colagem-homepage-tablet.png"
import bgHomepageMobile from "@/assets/imgs/homepage/colagem-homepage-mobile.png"

export default function HeroSection() {
    const { user } = useAuth()

    return (
        <section className="relative h-screen w-full">
            <img
                src={bgHomepageDesktop}
                alt="Colagem da Copa PAB - Desktop"
                className="hidden lg:block absolute inset-0 w-full h-full object-cover object-center"
            />

            <img
                src={bgHomepageTablet}
                alt="Colagem da Copa PAB - Tablet"
                className="hidden md:block lg:hidden absolute inset-0 w-full h-full object-cover object-center"
            />

            <img
                src={bgHomepageMobile}
                alt="Colagem da Copa PAB - Mobile"
                className="block md:hidden absolute inset-0 w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/50"></div>            <div className="relative flex justify-center items-center h-full">
                <Button variant="gradient" className="text-xl px-5 py-6 md:text-2xl md:p-6 cursor-pointer" asChild>
                    <Link to={user ? "/dashboard" : "/cadastrar"}>
                        {user ? `Bem-vinda, ${user.teamName}!` : "Inscreva-se na Copa PAB"}
                    </Link>
                </Button>
            </div>
        </section>
    )
}