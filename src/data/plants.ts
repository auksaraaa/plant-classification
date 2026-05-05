import takooImg from "@/assets/plant-takoo.jpg";
import lavenderImg from "@/assets/plant-lavender.jpg";
import aloeImg from "@/assets/plant-aloe.jpg";
import snakeImg from "@/assets/plant-snake.jpg";
import fiddleImg from "@/assets/plant-fiddle.jpg";
import pothosImg from "@/assets/plant-pothos.jpg";
import peaceLilyImg from "@/assets/plant-peace-lily.jpg";
import rubberImg from "@/assets/plant-rubber.jpg";

// Additional detail images
import takooLeafImg from "@/assets/plant-takoo-leaf.jpg";
import takooFlowerImg from "@/assets/plant-takoo-flower.jpg";
import takooBarkImg from "@/assets/plant-takoo-bark.jpg";
import lavenderFlowerImg from "@/assets/plant-lavender-flower.jpg";
import lavenderLeafImg from "@/assets/plant-lavender-leaf.jpg";
import aloeLeafImg from "@/assets/plant-aloe-leaf.jpg";
import aloeFlowerImg from "@/assets/plant-aloe-flower.jpg";
import snakeLeafImg from "@/assets/plant-snake-leaf.jpg";
import snakeFlowerImg from "@/assets/plant-snake-flower.jpg";
import fiddleLeafImg from "@/assets/plant-fiddle-leaf.jpg";
import fiddleBarkImg from "@/assets/plant-fiddle-bark.jpg";
import pothosLeafImg from "@/assets/plant-pothos-leaf.jpg";
import peaceLilyFlowerImg from "@/assets/plant-peace-lily-flower.jpg";
import peaceLilyLeafImg from "@/assets/plant-peace-lily-leaf.jpg";
import rubberLeafImg from "@/assets/plant-rubber-leaf.jpg";
import rubberBarkImg from "@/assets/plant-rubber-bark.jpg";

export interface PlantDetailImage {
  label: string;
  image: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  shortDescription: string;
  image: string;
  category: string;
  additionalImages?: PlantDetailImage[];
  characteristics: {
    leaf: string;
    flower: string;
    fruit: string;
    height: string;
    care: string;
  };
}

export const plants: Plant[] = [
  {
    id: "taku",
    name: "ตะกู (taku)",
    scientificName: "Neolamarckia cadamba (Roxb.) Bosser",
    description: "เป็นไม้ยืนต้นขนาดใหญ่ที่พบได้ในเขตร้อนของเอเชีย โดยเฉพาะในประเทศไทย อินเดีย และเอเชียตะวันออกเฉียงใต้ จัดอยู่ในวงศ์ Rubiaceae เป็นพรรณไม้ที่เติบโตเร็วและได้รับความนิยมในการปลูกเพื่อให้ร่มเงาและใช้ประโยชน์ทางเศรษฐกิจ",
    shortDescription: "ไม้ใบสวยงามที่มีรูพรุนเป็นเอกลักษณ์",
    image: takooImg,
    category: "ไม้ยืนต้น",
    additionalImages: [
      { label: "ใบ", image: takooLeafImg },
      { label: "ดอก", image: takooFlowerImg },
      { label: "เปลือก", image: takooBarkImg },
    ],
    characteristics: {
      leaf: "ใบเป็นใบเดี่ยว ออกเรียงตรงข้าม รูปไข่หรือรูปรี ขนาดค่อนข้างใหญ่ ปลายใบแหลม โคนใบมน ขอบใบเรียบ แผ่นใบหนาและเรียบ สีเขียวสด เส้นใบเห็นชัดเจน",
      flower: "ผลเป็นผลรวม ลักษณะกลม ขนาดเล็ก ภายในมีเมล็ดจำนวนมาก เมื่อสุกจะมีสีเหลืองถึงน้ำตาล และสามารถกระจายพันธุ์ได้ดี",
      fruit: "ดอกมีลักษณะเด่นเป็นช่อกลมคล้ายลูกบอล สีเหลืองถึงสีส้ม มีกลิ่นหอมอ่อน ๆ ออกดอกเป็นช่อเดี่ยวตามปลายกิ่ง",
      height: "ความสูงประมาณ 10–30 เมตร",
      care: "ชอบแสงรำไร รดน้ำสัปดาห์ละ 1-2 ครั้ง",
    },
  },
  {
    id: "lavender",
    name: "ลาเวนเดอร์",
    scientificName: "Lavandula angustifolia",
    description: "ลาเวนเดอร์เป็นไม้ดอกที่มีกลิ่นหอมอันเป็นเอกลักษณ์ นิยมใช้ในอุตสาหกรรมน้ำหอมและสปา ดอกสีม่วงสวยงามช่วยสร้างบรรยากาศผ่อนคลาย มีถิ่นกำเนิดในแถบเมดิเตอร์เรเนียน",
    shortDescription: "ไม้ดอกหอมสีม่วงสำหรับผ่อนคลาย",
    image: lavenderImg,
    category: "ไม้ดอก",
    additionalImages: [
      { label: "ดอก", image: lavenderFlowerImg },
      { label: "ใบ", image: lavenderLeafImg },
    ],
    characteristics: {
      leaf: "ใบเรียวยาว สีเขียวเทา มีขนละเอียด",
      flower: "ดอกเล็กสีม่วง เรียงเป็นช่อยาว กลิ่นหอม",
      fruit: "เมล็ดเล็กสีน้ำตาลเข้ม",
      height: "สูงประมาณ 30-60 ซม.",
      care: "ชอบแดดจัด ดินระบายน้ำดี รดน้ำน้อย",
    },
  },
  {
    id: "aloe",
    name: "ว่านหางจระเข้",
    scientificName: "Aloe vera",
    description: "ว่านหางจระเข้เป็นพืชอวบน้ำที่มีสรรพคุณทางยามากมาย เจลภายในใบใช้บำรุงผิวพรรณ รักษาแผลไหม้ และบรรเทาอาการผิวหนัง เป็นพืชที่ปลูกง่ายและดูแลไม่ยาก",
    shortDescription: "พืชสมุนไพรบำรุงผิวพรรณ",
    image: aloeImg,
    category: "สมุนไพร",
    additionalImages: [
      { label: "ใบ", image: aloeLeafImg },
      { label: "ดอก", image: aloeFlowerImg },
    ],
    characteristics: {
      leaf: "ใบอวบหนา สีเขียว มีหนามเล็กตามขอบ มีเจลใส",
      flower: "ดอกสีเหลืองหรือส้ม เป็นช่อยาว",
      fruit: "แคปซูลเมล็ดเล็ก",
      height: "สูงประมาณ 30-60 ซม.",
      care: "ชอบแดด ทนแล้ง รดน้ำ 2 สัปดาห์/ครั้ง",
    },
  },
  {
    id: "snake-plant",
    name: "ลิ้นมังกร",
    scientificName: "Sansevieria trifasciata",
    description: "ลิ้นมังกรเป็นไม้ฟอกอากาศชั้นเยี่ยมที่ NASA แนะนำ ช่วยดูดสารพิษในอากาศและปล่อยออกซิเจนในเวลากลางคืน เป็นพืชที่ทนทานมาก เหมาะสำหรับมือใหม่",
    shortDescription: "ไม้ฟอกอากาศยอดนิยม ดูแลง่าย",
    image: snakeImg,
    category: "ไม้ใบ",
    additionalImages: [
      { label: "ใบ", image: snakeLeafImg },
      { label: "ดอก", image: snakeFlowerImg },
    ],
    characteristics: {
      leaf: "ใบตั้งตรง แข็ง สีเขียวเข้มมีลายขวาง ขอบสีเหลือง",
      flower: "ดอกเล็กสีขาวเขียว หอมอ่อน ออกไม่บ่อย",
      fruit: "ผลกลมเล็กสีส้มแดง",
      height: "สูงประมาณ 60-120 ซม.",
      care: "ทนร่ม ทนแล้ง รดน้ำ 2-3 สัปดาห์/ครั้ง",
    },
  },
  {
    id: "fiddle-leaf",
    name: "ไทรใบสัก",
    scientificName: "Ficus lyrata",
    description: "ไทรใบสักเป็นไม้ประดับขนาดใหญ่ที่ได้รับความนิยมอย่างมากในการตกแต่งภายใน ใบใหญ่รูปไวโอลินเป็นเอกลักษณ์ ให้ความรู้สึกหรูหราและทันสมัย",
    shortDescription: "ไม้ประดับหรูหราใบใหญ่รูปไวโอลิน",
    image: fiddleImg,
    category: "ไม้ใบ",
    additionalImages: [
      { label: "ใบ", image: fiddleLeafImg },
      { label: "เปลือก", image: fiddleBarkImg },
    ],
    characteristics: {
      leaf: "ใบใหญ่รูปไวโอลิน สีเขียวเข้ม เส้นใบเด่นชัด",
      flower: "ออกดอกยากในร่ม",
      fruit: "ผลกลมเล็กสีเขียว (ไม่ค่อยเห็นในร่ม)",
      height: "สูงได้ถึง 2-3 เมตรในร่ม",
      care: "ชอบแสงสว่างทางอ้อม รดน้ำเมื่อดินแห้ง",
    },
  },
  {
    id: "pothos",
    name: "พลูด่าง",
    scientificName: "Epipremnum aureum",
    description: "พลูด่างเป็นไม้เลื้อยที่ปลูกง่ายที่สุดชนิดหนึ่ง มีใบรูปหัวใจสีเขียวสลับเหลือง ช่วยฟอกอากาศและเพิ่มความสดชื่นให้กับพื้นที่ เหมาะสำหรับแขวนหรือปลูกในกระถางให้เลื้อย",
    shortDescription: "ไม้เลื้อยปลูกง่าย ฟอกอากาศดี",
    image: pothosImg,
    category: "ไม้เลื้อย",
    additionalImages: [
      { label: "ใบ", image: pothosLeafImg },
    ],
    characteristics: {
      leaf: "ใบรูปหัวใจ สีเขียวสลับเหลืองทอง",
      flower: "ไม่ค่อยออกดอกเมื่อปลูกในร่ม",
      fruit: "ไม่มีผลเมื่อปลูกในร่ม",
      height: "เลื้อยได้ยาวหลายเมตร",
      care: "ทนร่ม รดน้ำสัปดาห์ละครั้ง",
    },
  },
  {
    id: "peace-lily",
    name: "สปาทิฟิลลัม",
    scientificName: "Spathiphyllum wallisii",
    description: "สปาทิฟิลลัมหรือดอกลิลลี่สันติภาพ เป็นไม้ดอกในร่มที่มีดอกสีขาวสวยงาม ช่วยฟอกอากาศได้ดีเยี่ยม เหมาะสำหรับห้องที่มีแสงน้อย ให้ความรู้สึกสะอาดและสงบ",
    shortDescription: "ไม้ดอกขาวสง่างาม ฟอกอากาศ",
    image: peaceLilyImg,
    category: "ไม้ดอก",
    additionalImages: [
      { label: "ดอก", image: peaceLilyFlowerImg },
      { label: "ใบ", image: peaceLilyLeafImg },
    ],
    characteristics: {
      leaf: "ใบยาวรีสีเขียวเข้มเป็นมัน",
      flower: "กาบดอกสีขาว ก้านดอกสีครีม",
      fruit: "ผลเล็กสีเขียว",
      height: "สูงประมาณ 40-60 ซม.",
      care: "ชอบร่ม ชอบความชื้น รดน้ำสม่ำเสมอ",
    },
  },
  {
    id: "rubber-plant",
    name: "ยางอินเดีย",
    scientificName: "Ficus elastica",
    description: "ยางอินเดียเป็นไม้ประดับใบสวยที่มีใบหนาเป็นมันสีเขียวเข้ม ให้ความรู้สึกเป็นธรรมชาติและสง่างาม เป็นไม้ที่ทนทานและดูแลง่าย ช่วยฟอกอากาศภายในอาคาร",
    shortDescription: "ไม้ใบเขียวเข้มเป็นมัน ทนทาน",
    image: rubberImg,
    category: "ไม้ใบ",
    additionalImages: [
      { label: "ใบ", image: rubberLeafImg },
      { label: "เปลือก", image: rubberBarkImg },
    ],
    characteristics: {
      leaf: "ใบหนารูปรี สีเขียวเข้มเป็นมัน",
      flower: "ออกดอกยากในร่ม",
      fruit: "ผลกลมเล็กสีเขียว",
      height: "สูงได้ถึง 2-3 เมตรในร่ม",
      care: "ชอบแสงสว่างทางอ้อม รดน้ำเมื่อดินแห้ง",
    },
  },
];

export const categories = ["ทั้งหมด", "ไม้ดอก", "ไม้ใบ", "สมุนไพร", "ไม้ยืนต้น", "ไม้น้ำ"];
