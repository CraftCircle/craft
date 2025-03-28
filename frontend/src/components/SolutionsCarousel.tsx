import SolutionCard from "@/components/SolutionsCard";

const cardData = [
  {
    imageSrc: "/16.svg",
    alt: "Events",
    bgColor: "#B3261E",
    title: "Host Seamless Events",
    description:
      "Sell tickets, manage guest lists, and create engaging in-event experiences.",
  },
  {
    imageSrc: "/10.svg",
    alt: "Appointments",
    bgColor: "#35938D",
    title: "Streamline Appointments",
    description:
      "Manage sessions with automated reminders—no more back-and-forth scheduling.",
  },
  {
    imageSrc: "/11.svg",
    alt: "Portfolio",
    bgColor: "#F7B501",
    title: "Showcase Your Work, Your Way",
    description:
      "Create a digital portfolio to promote your products, services, or creative work.",
  },
  {
    imageSrc: "/8.svg",
    alt: "Data",
    bgColor: "#121212",
    title: "Collect Documents, Data & More",
    description:
      "Smart forms for applications, registrations, and customer data.",
  },
 
];

// In render loop
{cardData.map((card, index) => (
  <SolutionCard key={index} {...card} />
))}
