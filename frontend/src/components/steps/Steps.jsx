import React from 'react';
import './Steps.css';
import { Ticket, MapPin, BadgePercent } from 'lucide-react'; 

const Steps = () => {
    const stepsData = [
        {
            id: 1,
            title: "Buy Membership",
            desc: "Get instant access to 500+ partner discounts for just ₹50",
            icon: <Ticket size={30} />,
            colorClass: "icon-blue"
        },
        {
            id: 2,
            title: "Visit Partners",
            desc: "Explore hotels, restaurants, and activity centers nearby",
            icon: <MapPin size={30} />,
            colorClass: "icon-green"
        },
        {
            id: 3,
            title: "Get 10% Off",
            desc: "Upload bill, verify OTP, and save instantly on every purchase",
            icon: <BadgePercent size={30} />,
            colorClass: "icon-yellow"
        }
    ];

    return (
        <section className="steps-container">
            <h2 className="steps-title">Simple 3-Step Process</h2>
            <div className="steps-wrapper">
                {stepsData.map((step) => (
                    <div className="step-card" key={step.id}>
                        <div className={`step-icon-wrapper ${step.colorClass}`}>
                            <span className="step-number-tag">{step.id}</span>
                            {step.icon}
                        </div>
                        <div className="step-info">
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Steps; //old 
