export const ADVENTURES = [
    {
        id: "star-hunter",
        title: "The Star Hunter: Chasing Asteroids from Rural Bihar",
        subtitle: "How a childhood curiosity under dark village skies led to a partnership with NASA.",
        date: "2020 - Present",
        category: "Life & Astronomy",
        coverImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1200&q=80",
        content: `
      <h3 class="text-2xl font-bold text-white mb-4">Origin Story</h3>
      <p class="mb-6 text-zinc-400">
        I was born in Sikahar, a rural village in Bihar. While many see lack of infrastructure as a disadvantage, I saw an opportunity: 
        minimal light pollution. The night skies were pristine canvases of cosmic history.
      </p>
      <p class="mb-6 text-zinc-400">
        What started as simple stargazing evolved into an obsession with celestial mechanics. I didn't just want to watch; I wanted to discover.
      </p>

      <h3 class="text-2xl font-bold text-white mb-4 mt-8">The NASA Collaboration</h3>
      <p class="mb-6 text-zinc-400">
        Through my organization, DeuxStem, I facilitated a partnership with the International Astronomical Search Collaboration (IASC), 
        a NASA-affiliated citizen science program. We analyze real astronomical data to identify Near-Earth Objects (NEOs).
      </p>
      
      <blockquote class="border-l-4 border-green-500 pl-4 my-8 italic text-zinc-300">
        "Two of our observations are currently under deep review by NASA as potential asteroid discoveries. From a village roof to the database of the world's leading space agency."
      </blockquote>
    `,
        media: [
            { type: "image", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" },
            { type: "image", url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80" }
        ],
        links: [
            { label: "Global Indian Feature", url: "https://www.globalindian.com/youth/story/cover-story/aman-anubhav-the-bihar-teen-impresses-nasa/" }
        ]
    },
    {
        id: "vyomagami",
        title: "Project VYOMAGAMI: Hacking Gravity",
        subtitle: "Designing a hybrid balloon-rocket launch system to slash satellite deployment costs by 60%.",
        date: "Research Phase",
        category: "Aerospace Innovation",
        coverImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80",
        content: `
      <h3 class="text-2xl font-bold text-white mb-4">The Problem</h3>
      <p class="mb-6 text-zinc-400">
        Rockets fight two enemies: gravity and atmosphere. Most fuel is burned just fighting through the thick lower atmosphere ("the soup"). 
        I wondered: Why fight it when you can float above it?
      </p>

      <h3 class="text-2xl font-bold text-white mb-4 mt-8">The "Crazy" Solution</h3>
      <p class="mb-6 text-zinc-400">
        VYOMAGAMI is a hybrid launch architecture. We use high-altitude weather balloons to lift the launch vehicle to the stratosphere (approx. 30km). 
        At this altitude, 99% of the atmospheric mass is below us.
      </p>
      
      <ul class="list-disc pl-6 mb-6 text-zinc-400 space-y-2">
        <li><strong>Stage 0:</strong> Balloon ascent (Zero fuel).</li>
        <li><strong>Stage 1:</strong> Rocket ignition in near-vacuum (Max efficiency).</li>
        <li><strong>Result:</strong> 60-70% reduction in fuel mass and structural weight.</li>
      </ul>

      <p class="mb-6 text-zinc-400">
        I presented this concept at SpaceOnova, detailing the physics simulations that validate the delta-V savings. It's bold, it's risky, and it's exactly the kind of engineering challenge I live for.
      </p>
    `,
        media: [],
        links: []
    },
    {
        id: "pavana",
        title: "PAVANA: The Synthetic Forest",
        subtitle: "Reversing climate change with thermodynamics and cast iron alloys.",
        date: "2020 - Present",
        category: "Climate Tech",
        coverImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
        content: `
      <h3 class="text-2xl font-bold text-white mb-4">Engineering vs. Nature</h3>
      <p class="mb-6 text-zinc-400">
        Trees are great, but they are slow. To tackle the climate crisis, we need industrial-scale carbon removal. 
        Existing Direct Air Capture (DAC) is too expensive ($600/ton). I set out to build a machine that "breathes" CO2 more efficiently than nature.
      </p>

      <h3 class="text-2xl font-bold text-white mb-4 mt-8">The Innovation</h3>
      <p class="mb-6 text-zinc-400">
        PAVANA utilizes a novel gradient composite metal chamber (Cast Iron + Copper). This creates extreme temperature differentials (250-400°C) 
        driven entirely by concentrated solar thermal power.
      </p>
      <p class="mb-6 text-zinc-400">
        By optimizing the phase-transition mechanism of the capture solution, we reduced the projected cost to <strong>$94-232 per ton</strong>. 
        Currently, I'm building a digital twin to simulate airflow patterns within the corrugated metal maze structure.
      </p>
    `,
        media: [],
        links: []
    }
];