import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ADDRESS_STATUS } from "../enum/address.status";
import { address_status } from "../interface/address-status.interface";

@Entity()
export class Address {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    phoneNumber: string


    @Column({type: 'enum', enum: ADDRESS_STATUS, default: "default"})
    status: address_status

}
