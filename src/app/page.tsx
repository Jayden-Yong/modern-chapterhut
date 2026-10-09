import Image from "next/image";
import HomeCard from "@/ui/components/HomeCard";

export default function Home() {
  const cardContent1 = "Chapterhut is a work of passion by an ordinary university student. At the start of its creation, Chapterhut is only but a simple blog intended to promote some budget friendly tech products that are currently on sale in the Chapterhut Store page. That simple blog served as a product page to present the wonderful selected products to patrons in an aesthetic way. However, to further realize the dream of creating a place for avid readers to settle in, Chapterhut took one small step to introduce Chapterhut Novels and Chapterhut Scribes for both authors and readers to find a sanctuary for their hobbies."
  const cardContent2 = "Chapterhut is a miniature project as of now. Although still in its infancy, more content and features will be added in time. Any support from users are much appreciated and feel free to contact me if you have any suggestions. In the mean time, enjoy our free light novel on Chapterhut Novels!"

  return (
    <main className="justify-center">
      <div className="font-poppins text-center space-y-2 md:space-y-6 md:mt-6">
        <h3 className="text-sm md:text-xl">A dream and passion</h3>
        <h1 className="text-6xl md:text-9xl font-bold">Realized</h1>
        <Image
          src='/dream-bubble.png'
          width={150}
          height={80}
          className="w-3/5 md:w-2/5 h-auto mx-auto"
          alt="Image of Dream Bubble"
        />
      </div>
      <HomeCard
        imgPath="/home/puzzle.png"
        cardTitle="About Chapterhut"
        cardContent={cardContent1}
        invertOrder={false}
      />
      <HomeCard
        imgPath="/home/growth.png"
        cardTitle="Growing with passion"
        cardContent={cardContent2}
        invertOrder={true}
      />
    </main>
  );
}
