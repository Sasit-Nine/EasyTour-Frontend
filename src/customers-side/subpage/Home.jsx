import React from "react"
import "../../css/Home.scss";
const Home = () => {
    return (
        <div className='contianer'>
            <div className='img'>
                <h1 className='text-quotation'>EXPLORE THE WHOLE WORLD AND ENJOY ITS BEAUTY</h1>
            </div>

            {/* ส่วนล่าง toptravel */}

            <div className='toptravel'>
                <h2>TOPTRAVEL</h2>
                <div className='cardlayer'>
                    <div className='cardtour'>
                        <div className='imgtour'>
                            <img src='https://img.kapook.com/u/2018/sutasinee/05/p1_1.jpg'/>
                        </div>
                        <div className='texttour'>
                            <div className='text'>เกาะหลีเป๊ะ จ.สตูล</div>
                            <button>seemore</button>
                        </div>
                    </div>
                    <div className='cardtour'>
                        <div className='imgtour'>
                            <img src='https://img.kapook.com/u/2018/sutasinee/05/p1_1.jpg'/>
                        </div>
                        <div className='texttour'>
                            <div className='text'>เกาะหลีเป๊ะ จ.สตูล</div>
                            <button>seemore</button>
                        </div>
                    </div>
                    <div className='cardtour'>
                        <div className='imgtour'>
                            <img src='https://img.kapook.com/u/2018/sutasinee/05/p1_1.jpg'/>
                        </div>
                        <div className='texttour'>
                            <div className='text'>เกาะหลีเป๊ะ จ.สตูล</div>
                            <button>seemore</button>
                        </div>
                    </div>
                    <div className='cardtour'>
                        <div className='imgtour'>
                            <img src='https://img.kapook.com/u/2018/sutasinee/05/p1_1.jpg'/>
                        </div>
                        <div className='texttour'>
                            <div className='text'>เกาะหลีเป๊ะ จ.สตูล</div>
                            <button>seemore</button>
                        </div>
                    </div>
                </div></div>

        </div>
    )
}
export default Home