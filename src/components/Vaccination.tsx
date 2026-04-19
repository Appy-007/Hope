import Image from "next/image"
import vaccination_image from "../assets/street-dogs-5903305_640.jpg"
export default function Vaccination(){
    return (
        <>
        <div className="flex gap-4 px-4 items-center bg-stone-300 py-10">
            <div>
                <p>Help those little paws roam freely by vaccinating</p>
                <p>Contact your nearest NGO about about conducting a vaccination programme in your locality</p>

                <p>Come together and work collectiveliy towards a better society</p>
            </div>
            <div>
                <Image src={vaccination_image} alt="vaccination_image"/>
            </div>
            
        </div>
        </>
    )
}