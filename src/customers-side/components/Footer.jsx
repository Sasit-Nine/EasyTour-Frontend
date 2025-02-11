import React from "react";
import "../../css/Footer.scss"

const Footer = () => {
    return (
        <div className='Footer'>

            {/* ส่วนบนหัวข้อ */}
            <section className='Container-footer'>
                <div className='Developer'>
                    <section className='Member'>
                        <h2>EasyTour</h2>
                        <h3>Developer</h3>
                        <p>นายปรัชญา วัฒนาศรีโรจน์</p>
                        <p>ID : 6710110246</p>
                        <p>ตำแหน่ง : Frontend & Database</p>
                        <br></br>
                        <p>นายวีรภัทร แก้วทอน</p>
                        <p>ID : 6710110391</p>
                        <p>ตำแหน่ง : Frontend & Css</p>
                        <br></br>
                        <p>นายศศิศ สวนแสดง</p>
                        <p>ID : 6710110400</p>
                        <p>ตำแหน่ง : Fullstack</p>
                        <br></br>
                        <p>นายสุรยุทธ สุขมาศ</p>
                        <p>ID : 6710110463</p>
                        <p>ตำแหน่ง : Frontend & CSS</p>
                    </section>
                    <section className='Contacts'>

                    </section>
                </div>


                {/* ส่วนล่าง */}

                <div className=''>
                    <div className=''></div>
                </div>
            </section>
            <section className='@'>
                <p>Copyright © 2025 EasyTour. All rights reserved</p>
            </section>
        </div>
    )
}

export default Footer;

