import { NextResponse, NextRequest } from "next/server";
const nodemailer = require("nodemailer")

export async function POST (request) {
    try {
        const username = process.env.EMAIL;
        const password = process.env.EMAIL_CODE;
        const {customer_email, link} = await request.json();
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, 
            secure: false, 
            auth: {
                user: username, 
                pass: password,
    
            },
            tls: {
                ciphers:'SSLv3'
            }
        })
    
        const info = await transporter.sendMail({
            from: username,
            to: customer_email,
            subject: "Rider has get your order",
            html: `<h1>Rider has get your order</h1><br />
            <span>Chat with rider: <a href="${process.env.SITE_URL}/chat/${link}">Link</a></span>
            <span>See live location of rider: <a href="${process.env.SITE_URL}/live/${link}">Link</a></span>
            `
        })
        console.log("mail has been send")
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "hello world"}, {status: 400})
    }   

    return NextResponse.json({message: "hello world"})
}