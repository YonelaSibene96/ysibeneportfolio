import { Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
}

export const ExperienceSection = () => {
  const experiences: Experience[] = [
    {
      period: "2025 - Present",
      title: "Digital Associate",
      company: "CAPACITI",
      description: "Supporting digital transformation initiatives and technology implementation projects. Collaborating with cross-functional teams on digital solutions and process improvements. Contributing to training and development programs for digital literacy and participating in agile methodologies and continuous improvement processes.",
    },
    {
      period: "2022 - 2025",
      title: "Sales Administrator",
      company: "Vox Telecom",
      description: "Successfully conducted area feasibility checks and generated sales quotes.",
    },
    {
      period: "2022 - 2023",
      title: "Assistant & Facilitator",
      company: "The Learning Trust",
      description: "Voluntarily group facilitation of school children between the ages of 6 and 16. Contributed to alleviating the number of children affected by socioeconomic issues due to not having a solid support structure or secure environment to be in after school. Successfully managed after school coaches, organised activities, facilitated discussions and attendance using an online platform provided by the organisation.",
    },
    {
      period: "2021 - 2022",
      title: "Data Capturing Specialist",
      company: "The National Sea Rescue Institute",
      description: "Contributed to saving over 1100 lives through administrative support to our sales team which telephonically collected donations and attained new donors to fund responsive station rescues. This role consisted of manual recording of sales, capturing donor details, sending emails, renewing donor certificates, compiling donation reports and training of new sales consultants on team policies and procedures to enhance productivity and performance.",
    },
    {
      period: "2019 - 2021",
      title: "Intern",
      company: "Vox Telecom",
      description: "Assisted sales teams achieve their monthly targets through supporting them with administrative tasks such as filing, meeting coordination, compilation and submission of business partner agreements as well as monitoring sales reports for accuracy.",
    },
    {
      period: "2018",
      title: "Sales Agent",
      company: "Teleperformance CPT",
      description: "Successfully responded to UK customer queries via the phone. Providing them with different information they required with regards to their subscription packages. Assisted customers with package top ups, SIM card blocking, phone theft reporting as well as sim swap generation.",
    },
    {
      period: "2017",
      title: "Customer Service Associate",
      company: "Amazon CPT",
      description: "Successfully interacted with USA customers providing them with sales support through tracking of their orders, ensuring swift and accurate deliveries as well as retrieval of lost or incorrectly delivered packages. Successfully built rapport and resolved customer complaints by providing them with helpful information in a timely and satisfactory manner. Achieved monthly call targets which resulted in positive and constructive appraisal.",
    },
  ];

  return (
    <section id="experience" className="min-h-screen flex items-center py-20 bg-gradient-to-b from-muted to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-foreground mb-12 flex items-center gap-3">
            <Briefcase className="h-10 w-10 text-accent" />
            Work Experience
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-8 md:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-0 md:left-6 top-6 w-4 h-4 rounded-full bg-accent border-4 border-background" />

                  <Card className="p-6 hover:shadow-lg transition-shadow border-border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-accent font-medium">{exp.company}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 md:mt-0">{exp.period}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{exp.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
