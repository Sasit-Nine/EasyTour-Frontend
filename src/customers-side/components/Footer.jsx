import planeImg from "../../assets/plane.png";
const Footer = () => {
    return (
      <footer className="bg-[#F8644B]">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <img
                alt="Company name"
                src={planeImg}
                className="h-9"
              />
              <p className="text-sm/6 text-balance text-white">
                Making the world a better place through constructing elegant hierarchies.
              </p>
              <div className="flex gap-x-6">
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm/6 font-semibold text-white">Developer</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                        <a className="text-sm/6 text-white">นายศศิศ สวนแสดง <br/> Full Stack Developer</a>
                    </li>
                    <li>
                        <a className="text-sm/6 text-white">นายสุรยุทธ สุขมาศ <br/> Front End Developer</a>
                    </li>
                    <li>
                        <a className="text-sm/6 text-white">นายวีรภัท แก้วทอน Front End Developer</a>
                    </li>
                    <li>
                        <a className="text-sm/6 text-white">บริษัท ปรัชญา Front End Developer</a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm/6 font-semibold text-white">Support</h3>
                  <ul role="list" className="mt-6 space-y-4">
                    <li>
                        <a className="text-sm/6 text-white">บริษัท ไวท์ซอฟต์ โซลูชั่น จำกัด</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
            <p className="text-sm/6 text-white  ">&copy; 2024 Your Company, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
export default Footer