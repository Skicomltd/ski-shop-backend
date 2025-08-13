import { Injectable } from "@nestjs/common"
import { PdfInterface } from "./interface/pdf.interface"
import PDFDocument from "pdfkit"

@Injectable()
export class PdfService {
  async generatePdf(data: PdfInterface) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: [595.5, 842.7],
          margin: 50,
          info: {
            Title: `Vendor Profile - ${data.profile.storeName}`,
            Author: "Vendor Management System",
            Subject: "Vendor Profile Document",
            Creator: "Vendor Profile Service"
          }
        })

        const buffer: Buffer[] = []

        doc.on("data", buffer.push.bind(buffer))
        doc.on("error", (err) => {
          console.error("PDF generation error:", err)
          reject(err)
        })
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffer)
          if (!pdfBuffer || pdfBuffer.length === 0) {
            reject(new Error("Generated PDF buffer is empty"))
          } else {
            resolve(pdfBuffer)
          }
        })

        doc.font("Helvetica")

        doc.fillColor("#1DA1F2").opacity(0.1).rect(50, 50, 495, 60).fill()

        doc.opacity(1).fontSize(20).fillColor("#1DA1F2").text(`Vendor'S Profile - ${data.profile.storeName}`, 50, 60, { align: "center" })

        // PROFILE OVERVIEW
        let yPos = 130

        doc.fontSize(12).fillColor("#000000").text("Profile Overview", 50, yPos)

        yPos += 20

        doc.fontSize(10).fillColor("#666666").text(`Store Name: ${data.profile.storeName}`)
        yPos += 15
        doc.text(`Email Address: ${data.profile.email || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Phone Number: ${data.profile.phoneNumber || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Date Joined: ${data.profile.dateJoined || "-"}`, 70, yPos)
        yPos += 20
        doc.text(`Orders: ${data.profile.orders || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`KYC Status: ${data.profile.kycStatus || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Subscription Status: ${data.profile.subscriptionStatus || "-"}`, 70, yPos)

        // Business and Kyc Information
        yPos += 20

        doc.fontSize(12).fillColor("#000000").text("Business & KYC Information", 50, yPos)
        yPos += 20
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text(`Business Name (As registered): ${data.business.businessName || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`CAC Reg. No: ${data.business.CacRegNo || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`KYC Type: ${data.business.kycType || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Identification Number: ${data.business.kycIdentificationNumber || "-"}`, 70, yPos)

        // Subscription Information
        yPos += 20
        doc.fontSize(12).fillColor("#000000").text("Subscription Information", 50, yPos)

        yPos += 20
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text(`Status: ${data.subscription.status || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Plan Type: ${data.subscription.planType || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Payment Status: ${data.subscription.paymentStatus || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`Start Date: ${data.subscription.startDate || "-"}`, 70, yPos)
        yPos += 15
        doc.text(`End Date: ${data.subscription.endDate || "-"}`, 70, yPos)

        // Product & Sales Performance

        yPos += 20
        doc.fontSize(12).fillColor("#000000").text("Product & Sales Performance", 50, yPos)
        yPos += 20
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text(`Total Products: ${data.product.totalProduct || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Total Product Published: ${data.product.totalPublishedProduct || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Total Sales: ${data.product.totalSales || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Total Orders: ${data.product.totalOrders || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Average Order Value: ${data.product.averageNumberOfOrder || "N0"}`, 70, yPos)

        // Payouts Overview
        yPos += 20
        doc.fontSize(12).fillColor("#000000").text("Payouts Overview", 50, yPos)
        yPos += 20
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text(`Wallet Balance: ${data.payout.walletBalance || "N0"}`, 70, yPos)
        yPos += 15
        doc.text(`Total Withdrawals: ${data.payout.totalWithdrawal || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Pending Withdrawal: ${data.payout.pendingWithdrawal || 0}`, 70, yPos)
        yPos += 15
        doc.text(`Last Payout: ${data.payout.lastPayout || "-"}`, 70, yPos)

        // Order History
        yPos += 20
        doc.fontSize(12).fillColor("#000000").text("Order History", 50, yPos)
        yPos += 20
        doc
          .fontSize(10)
          .fillColor("#666666")
          .text(`Order ID`, 70, yPos)
          .text(`Date Ordered`, 200, yPos)
          .text(`Buyer`, 300, yPos)
          .text(`Total Amount`, 400, yPos)
          .text(`Status`, 500, yPos)
        yPos += 15
        const orders = data.orders || []
        orders.forEach((order) => {
          yPos += 15
          doc
            .text(order.id || "-", 70, yPos)
            .text(order.dateOrdered ? order.dateOrdered.toISOString() : "-", 200, yPos)
            .text(order.buyerName || "-", 300, yPos)
            .text(`${order.totalAmount || 0}`, 400, yPos)
            .text(order.status || "-", 500, yPos)
        })

        doc.end()
      } catch (error) {
        console.error("Detailed PDF generation error:", error)
        reject(error)
      }
    })
  }
}
