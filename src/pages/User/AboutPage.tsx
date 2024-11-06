import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-[#0E101C] text-[#FDFBF6] min-h-screen">
      <header className="bg-[#2E2E2E] text-white py-12 text-center">
        <h1 className="text-5xl font-extrabold">About PentaLuxe</h1>
        <p className="mt-3 text-lg italic">A Symphony of Scents, Crafted with Passion</p>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-8">Our Essence</h2>
        <p className="text-center text-lg leading-relaxed">
          At PentaLuxe, we believe that perfume is more than just a fragrance—it's an expression of identity, a memory in a bottle,
          and an intimate art form. Each scent we create is crafted to tell a unique story, blending traditional artisanal skills 
          with innovative techniques. We invite you to explore the world of luxury and elegance that is PentaLuxe.
        </p>
      </section>

      <section className="bg-[#2E2E2E] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-semibold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-[#B2C7A7] text-[#0E101C] shadow-md rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Craftsmanship</h3>
              <p>
                Our perfumes are crafted with precision, combining age-old techniques with a modern touch.
                Each blend is meticulously designed to captivate the senses.
              </p>
            </div>
            <div className="p-8 bg-[#B2C7A7] text-[#0E101C] shadow-md rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Elegance</h3>
              <p>
                We believe in timeless elegance, delivering fragrances that are refined, luxurious, and unforgettable.
              </p>
            </div>
            <div className="p-8 bg-[#B2C7A7] text-[#0E101C] shadow-md rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Sustainability</h3>
              <p>
                We are committed to sustainable practices, sourcing ethically and crafting responsibly, to bring you beauty with a conscience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-semibold text-center mb-8">Our Perfumers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-[#2E2E2E] shadow-md rounded-lg">
            <img
              src="https://www.seekpng.com/png/detail/219-2190977_circle-profile-no-background-png-120dpi-page001-gentleman.png"
              alt="Perfumer"
             className=" mx-auto w-52 h-52 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-bold text-white">Aiden Leclair</h3>
            <p className="text-gray-400">Master Perfumer</p>
          </div>
          <div className="p-8 bg-[#2E2E2E] shadow-md rounded-lg">
            <img
              src="https://media.istockphoto.com/id/1154642632/photo/close-up-portrait-of-brunette-woman.jpg?s=612x612&w=0&k=20&c=d8W_C2D-2rXlnkyl8EirpHGf-GpM62gBjpDoNryy98U="
              alt="Perfumer"
              className=" mx-auto w-52 h-52 object-cover rounded-full mb-4"
            />
            <h3 className="text-xl font-bold text-white">Elara Moreau</h3>
            <p className="text-gray-400">Chief Scent Designer</p>
          </div>
          <div className="p-8 bg-[#2E2E2E] shadow-md rounded-lg">
            <img
              src="https://img.freepik.com/premium-photo/office-finance-proud-business-man-company-portrait-job-motivation-career-goals-leadership-with-smile-corporate-manager-boss-executive-happy-with-workplace-vision-success_590464-98801.jpg"
              alt="Perfumer"
              className=" mx-auto w-52 h-52  object-cover  rounded-full mb-4"
            />
            <h3 className="text-xl font-bold text-white">Luca Rivera</h3>
            <p className="text-gray-400">Creative Director</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#2E2E2E] text-white py-8">
        <p className="text-center">© 2024 PentaLuxe. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
