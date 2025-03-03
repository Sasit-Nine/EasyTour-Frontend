import planeImg from "../../assets/plane.png";
import { motion } from "framer-motion";
const Footer = () => {
  return (
    <footer className="bg-[#F8644B]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-20 lg:px-8 lg:pt-">
        <div className="xl:grid xl:grid-cols- xl:gap-8">
          <div className="space-y-8">
            <img
              alt="Company name"
              src={planeImg}
              className="h-9"
            />
            <p className="text-m/6 font-black text-balance text-white">
              EXPLORE THE WHOLE WORLD<br />AND ENJOY ITS BEAUTY
            </p>
            <div className="flex gap-x-6">
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-1 xl:mt-0">
            <div className="md:grid md:grid-cols-4 md:gap-8 xl:col-span-1">
              <div>
                <h3 className="text-xl/6 font-semibold text-white">Developer</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a className="text-m/6 text-white">นายศศิศ สวนแสดง<br /> ID : 6710110400 <br /> Full Stack Developer</a>
                  </li>
                  <li>
                    <a className="text-m/6 text-white">นายสุรยุทธ สุขมาศ<br /> ID : 6710110463 <br /> Front End Developer</a>
                  </li>
                  <li>
                    <a className="text-m/6 text-white">นายวีรภัท แก้วทอน<br /> ID : 6710110391 <br /> Front End Developer</a>
                  </li>
                  <li>
                    <a className="text-m/6 text-white">ปรัชญา วัฒนาศรีโรจน์<br /> ID : 6710110246 <br /> Front End Developer</a>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-xl/6 font-semibold text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <a className="text-m/6 text-white">บริษัท ไวท์ซอฟต์ โซลูชั่น จำกัด</a>
                  </li>
                </ul>
              </div>
              <div className="space-y-5 mt-10 md:mt-0">
                <h3 className="text-xl/6 font-semibold text-white">Contact Project</h3>
                <div className="flex flex-col gap-y-1 ">
                  <div className="flex items-center gap-x-2">
                    <p className="text-white">Frontend</p>
                    <a
                      href="https://github.com/Sasit-Nine/EasyTour-Frontend.git"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        alt="GitHub Icon"
                        className="w-8 h-8 invert brightness-0"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.1 }}
                      />
                    </a>
                  </div>

                  <div className="flex items-center gap-x-3">
                    <p className="text-white text-center">Backend</p>
                    <a
                      href="https://github.com/Sasit-Nine/EasyTour-Backend.git"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <motion.img
                        src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                        alt="GitHub Icon"
                        className="w-8 h-8 invert brightness-0"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.1 }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div className="bg-[#cf503a] mt-16 border-t-2 border-white p-5 sm:mt-20 lg:mt-24 flex justify-center items-center text-center">
        <p className="text-base text-white">
          &copy; 2024 Your Company, Inc. All rights reserved.
        </p>
      </div>

    </footer>
  )
}
export default Footer