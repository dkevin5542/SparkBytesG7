import React from 'react';
import '@/app/styles/contact.css';


/**
 * Contact Component
 *
 * Displays the "Contact Us" page for the Spark Bytes application.
 * 
 * Purpose:
 * - Provides contact information for the Spark Bytes team.
 * - Allows users to reach out for questions or assistance.
 *
 * Usage:
 * Added to the "Contact" page to give users easy access to team contact details.
 *
 * Features:
 * - Lists team members along with their phone numbers and email addresses.
 * - Includes clickable email links.
 *
 * Styling:
 * Inline padding for consistent spacing.
 */


const Contact: React.FC = () => {
  const contacts = [
    { 
      name: "Kevin", 
      phone: "718-316-8052", 
      email: "dkevin@bu.edu", 
      image: "https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png" 
    },
    { 
      name: "Dana", 
      phone: "617-901-1450", 
      email: "dalzahed@bu.edu", 
      image: "https://via.placeholder.com/100?text=Dana" 
    },
    { 
      name: "Ming", 
      phone: "415-996-5446", 
      email: "soongming18@gmail.com", 
      image: "https://avatars.githubusercontent.com/u/23645424?v=4" 
    },
    { 
      name: "Josh", 
      phone: "917-376-4766", 
      email: "jhsualva@bu.edu", 
      image: "https://via.placeholder.com/100?text=Josh" 
    }
  ];

  return (
    <div className="contact-page">
      <div className="contact-content">
        {contacts.map((contact, index) => (
          <div className="contact-card" key={index}>
            <img
              src={contact.image}
              alt={`${contact.name}'s profile`}
            />
            <div className="contact-info">
              <strong>{contact.name}</strong>
              <p>{contact.phone}</p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;