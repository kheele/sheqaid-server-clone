const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
	// console.log(req.path, req.body)
	const data = [
		{
			"Name": "John Smith",
			"Company": "Forestry Innovations Ltd",
			"Email": "john.smith@email.com",
			"Phone": "+27 55 123 4567",
			"Sector": "Forestry",
			"Service": "HSE Consulting Contract",
			"Progress": "Initial Contact",
			"Date": "16-01-2024",
			"Follow-up Date": "20-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Interested in HSE consulting solutions"
		},
		{
			"Name": "Mary Johnson",
			"Company": "Construction Dynamics",
			"Email": "mary.johnson@email.com",
			"Phone": "+27 55 987 6543",
			"Sector": "Construction",
			"Service": "HSE Safety File",
			"Progress": "Follow-up",
			"Date": "17-01-2024",
			"Follow-up Date": "22-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Requested HSE consulting for machinery"
		},
		{
			"Name": "Robert Davis",
			"Company": "Mining Solutions Inc",
			"Email": "robert.davis@email.com",
			"Phone": "+27 55 555 5555",
			"Sector": "Mining",
			"Service": "HSE Training",
			"Progress": "Meeting Scheduled",
			"Date": "18-01-2024",
			"Follow-up Date": "25-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Exploring HSE training opportunities"
		},
		{
			"Name": "Sarah Brown",
			"Company": "Chemical Innovations",
			"Email": "sarah.brown@email.com",
			"Phone": "+27 55 876 5432",
			"Sector": "Chemicals",
			"Service": "HSE Consulting Contract",
			"Progress": "Proposal Sent",
			"Date": "19-01-2024",
			"Follow-up Date": "24-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Reviewing HSE consulting options"
		},
		{
			"Name": "Emily Anderson",
			"Company": "Manufacturing Solutions",
			"Email": "emily.anderson@email.com",
			"Phone": "+27 55 234 5678",
			"Sector": "Manufacturing",
			"Service": "HSE Safety File",
			"Progress": "Negotiation",
			"Date": "20-01-2024",
			"Follow-up Date": "26-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Discussing HSE terms for solar panel installation"
		},
		{
			"Name": "Kevin Wilson",
			"Company": "Forestry Solutions",
			"Email": "kevin.wilson@email.com",
			"Phone": "+27 55 678 9012",
			"Sector": "Forestry",
			"Service": "HSE Training",
			"Progress": "Initial Contact",
			"Date": "21-01-2024",
			"Follow-up Date": "28-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Inquired about HSE training services"
		},
		{
			"Name": "Linda Miller",
			"Company": "Mining Innovations Ltd",
			"Email": "linda.miller@email.com",
			"Phone": "+27 55 789 0123",
			"Sector": "Mining",
			"Service": "HSE Consulting Contract",
			"Progress": "Follow-up",
			"Date": "22-01-2024",
			"Follow-up Date": "27-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Interested in upgrading HSE infrastructure"
		},
		{
			"Name": "Alex Thompson",
			"Company": "Construction Innovations",
			"Email": "alex.thompson@email.com",
			"Phone": "+27 55 345 6789",
			"Sector": "Construction",
			"Service": "HSE Training",
			"Progress": "Meeting Scheduled",
			"Date": "23-01-2024",
			"Follow-up Date": "29-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Exploring HSE training services"
		},
		{
			"Name": "Jessica White",
			"Company": "Manufacturing Dynamics",
			"Email": "jessica.white@email.com",
			"Phone": "+27 55 876 5432",
			"Sector": "Manufacturing",
			"Service": "HSE Safety File",
			"Progress": "Proposal Sent",
			"Date": "24-01-2024",
			"Follow-up Date": "31-01-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Requested HSE information on product offerings"
		},
		{
			"Name": "Michael Brown",
			"Company": "Chemical Solutions Inc",
			"Email": "michael.brown@email.com",
			"Phone": "+27 55 123 4567",
			"Sector": "Chemicals",
			"Service": "HSE Consulting Contract",
			"Progress": "Initial Contact",
			"Date": "25-01-2024",
			"Follow-up Date": "01-02-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Discussing HSE software development needs"
		},
		{
			"Name": "Rachel Adams",
			"Company": "Forestry Growth Partners",
			"Email": "rachel.adams@email.com",
			"Phone": "+27 55 234 5678",
			"Sector": "Forestry",
			"Service": "HSE Training",
			"Progress": "Follow-up",
			"Date": "26-01-2024",
			"Follow-up Date": "02-02-2024",
			"Lead By": "Support@sheqsolve.com",
			"Assigned To": "Anel@sheqsolve.com",
			"Notes": "Considering HSE financial planning services"
		}
	];
	res.json(data);
});

module.exports = router;
