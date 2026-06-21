"use client";

import {useRef} from "react";
import React from "react";

import {motion, useScroll, useTransform, MotionValue} from "framer-motion";

// Types
interface iIPicture {
	src: string;
	scale: MotionValue<number>;
}

interface iImmersiveScrollGalleryProps {
	images?: iIPicture[]; // Optional custom images array
	className?: string; // Optional className for container customization
}

// Constants
const DEFAULT_IMAGES = [
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
	{
		src: "https://images.unsplash.com/photo-1612801356940-8fdcde8aef61?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
		scale: null as any,
	},
];

const IMAGE_STYLES = [
	"w-[25vw] h-[25vh]",
	"w-[35vw] h-[30vh] -top-[30vh] left-[5vw]",
	"w-[20vw] h-[55vh] -top-[15vh] -left-[25vw]",
	"w-[25vw] h-[25vh] left-[27.5vw]",
	"w-[20vw] h-[30vh] top-[30vh] left-[5vw]",
	"w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]",
	"w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]",
];

/**
 * ImmersiveScrollGallery Component
 *
 * A scroll-based image zoom effect component that creates a parallax-like experience.
 * Images scale up as the user scrolls, creating an immersive visual effect.
 *
 * @param {iImmersiveScrollGalleryProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
const ImmersiveScrollGallery: React.FC<iImmersiveScrollGalleryProps> = ({
	images = DEFAULT_IMAGES,
	className = "",
}) => {
	// Refs
	const container = useRef<HTMLDivElement | null>(null);

	// Scroll and transform hooks
	const {scrollYProgress} = useScroll({
		target: container,
		offset: ["start start", "end end"],
	});

	// Transform values (adjusted for 250vh scroll)
	const scale4 = useTransform(scrollYProgress, [0, 0.7], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 0.7], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 0.7], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 0.7], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 0.7], [1, 9]);
	
	// As fotos começam a sumir no meio e desaparecem 100% no ponto 0.7
	const opacityImage = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
	
	// O texto só começa a aparecer quando as fotos estão sumindo e fica fixo no final
	const opacitySection2 = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]);

	// Assign scales to images
	const pictures = images.map((img, index) => {
		return {
			...img,
			// `index % 7` está sempre em 0–6, então o acesso nunca é undefined;
			// o `!` afasta o alargamento do noUncheckedIndexedAccess.
			scale: [scale4, scale5, scale6, scale5, scale6, scale8, scale9][
				index % 7
			]!,
		};
	});

	return (
		<div ref={container} className={`relative h-[250vh] ${className}`}>
			<div className="sticky top-0 h-[100vh] overflow-hidden">
				{/* Zooming Images */}
				{pictures.map(({src, scale}, index) => {
					return (
						<motion.div
							key={index}
							style={{scale, opacity: opacityImage}}
							className="absolute flex items-center justify-center w-full h-full top-0"
						>
							<div className={`relative ${IMAGE_STYLES[index]}`}>
								<img
									src={src}
									alt={`Zoom image ${index + 1}`}
									className="object-cover w-full h-full"
								/>
							</div>
						</motion.div>
					);
				})}

				{/* Content Section */}
				<motion.div
					style={{
						opacity: opacitySection2,
						scale: useTransform(scrollYProgress, [0.65, 0.85], [0.8, 1]),
					}}
					className="w-full h-full flex items-center justify-center max-w-3xl mx-auto p-8 relative"
				>
					<h1
						className="text-[#4b3f33] text-2xl md:text-4xl font-normal py-4 font-tiemposHeadline"
						style={{lineHeight: 1.5}}
					>
						Não é sobre o tênis, é sobre onde ele te leva. A marca Jordan representa uma mentalidade implacável de excelência, inspirada na lenda que desafiou a gravidade e redefiniu a grandeza. A cada silhueta, celebramos o passado construindo o futuro da cultura sneaker, elevando quem não tem medo de voar alto.
					</h1>
				</motion.div>
			</div>
		</div>
	);
};

export default ImmersiveScrollGallery;
