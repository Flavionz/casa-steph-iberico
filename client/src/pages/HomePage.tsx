import { HeroSection } from '../components/HeroSection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { AboutSection } from '../components/AboutSection';

export const HomePage = () => {
    return (
        <div className="min-h-screen bg-[#1E1B18]">
            <HeroSection />
            <FeaturedProducts />
            <AboutSection />
        </div>
    );
};