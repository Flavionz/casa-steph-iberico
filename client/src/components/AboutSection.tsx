export const AboutSection = () => {
  return <section id="about" className="py-20 bg-darkAccent relative overflow-hidden">
    <div className="absolute inset-0 opacity-10 z-0" style={{
      backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")`
    }}></div>
    <div className="container-custom relative z-10">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">
          L'Authenticité avant tout
        </h2>
        <div className="w-20 h-0.5 bg-gold mx-auto mb-8"></div>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">
          Chez Casa Steph Iberico, nous parcourons les régions ibériques pour
          vous rapporter des produits d'exception. Chaque produit est
          sélectionné avec soin directement auprès de producteurs locaux qui
          perpétuent un savoir-faire ancestral.
        </p>
        <p className="text-gray-300 text-lg leading-relaxed">
          Notre engagement: vous faire découvrir l'Espagne authentique à
          travers ses saveurs les plus raffinées, sans compromis sur la
          qualité.
        </p>
      </div>
    </div>
  </section>;
};