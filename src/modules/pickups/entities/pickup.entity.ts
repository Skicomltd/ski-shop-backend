import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm"
import { PICKUP_STATUS } from "../enum/pickup.status"
import { pickup_status } from "../interface/pickup-status.interface"


@Entity()
export class Pickup {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column()
    contactPerson: string


    @Column()
    address: string

    @Column()
    phoneNumber: string
    
    @Column({ type: "enum", enum: PICKUP_STATUS, default: "active" })
    status: pickup_status

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
