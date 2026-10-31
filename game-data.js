/* Fictional teaching scenarios. Scores are authored game rules, not measurements. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RiverGameData = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const sources = {
    monitoring: { label: 'EPA: how rivers are monitored', url: 'https://www.epa.ie/our-services/monitoring--assessment/freshwater--marine/rivers/' },
    habitat: { label: 'NPWS: protected habitats and sites', url: 'https://www.npws.ie/protected-sites' },
    catchments: { label: 'Catchments.ie: water, evidence and community action', url: 'https://www.catchments.ie/' },
    energy: { label: 'SEAI: Energy in Ireland', url: 'https://www.seai.ie/data-and-insights/seai-statistics/key-publications/energy-in-ireland' },
    reporting: { label: 'European Commission: data-centre sustainability reporting', url: 'https://energy.ec.europa.eu/news/commission-adopts-eu-wide-scheme-rating-sustainability-data-centres-2024-03-15_en' }
  };
  const characters = {
    beaver: { label: 'Beaver', example: 'Willow', image: 'assets/images/beaver-facing-viewer.png', focus: 'Wetlands, drainage and habitat', followUp: 'habitat' },
    otter: { label: 'Otter', example: 'Ripple', image: 'assets/images/otter-facing-viewer.png', focus: 'Food webs, pollution and river corridors', followUp: 'monitoring' }
  };
  const choice = (id, text, health, knowledge, feedback) => ({ id, text, health, knowledge, feedback });
  const challenges = {
    beaver: [
      {
        id: 'wetland-plan', type: 'Wetlands & planning', title: 'Where should the campus go?',
        copy: 'A proposed campus would cut across a wetland. The community has time to submit one main request. Which is strongest?',
        why: 'Begin with the location and connections of existing habitat. Replacement planting and monitoring have roles, but cannot by themselves justify losing a functioning wetland.',
        sources: ['habitat'], best: 'avoid', choices: [
          choice('plant', 'Accept the location if the developer funds a new pond nearby.', -4, 3, 'A new pond could add habitat, but it may not replace the wetland’s drainage, soils or connections. Ask what can be protected before agreeing to compensation.'),
          choice('avoid', 'Map the wetland and seek a layout that avoids it, with enforceable buffers.', 8, 10, 'This puts avoidance first and connects the habitat evidence to a specific design request. The buffer and drainage plan still need local assessment.'),
          choice('monitor', 'Keep the layout, but request annual wildlife surveys after construction.', 3, 6, 'Surveys can reveal change, but they arrive too late to prevent the initial loss. Pair monitoring with protection before construction.')
        ]
      },
      {
        id: 'storm-drainage', type: 'Drainage & floodplains', title: 'Rain will run off the new roads',
        copy: 'Paved surfaces could send rainwater towards the river. What should the coalition ask the design team to assess first?',
        why: 'Drainage changes can move pressure downstream. A catchment view asks where water goes, what it carries and which habitats or homes could be affected.',
        sources: ['catchments'], best: 'catchment', choices: [
          choice('pipe', 'Use a larger pipe to move rainwater off the site quickly.', -4, 3, 'A larger pipe may solve a site problem while moving the pressure downstream. Ask for evidence of what happens beyond the boundary.'),
          choice('pond', 'Add one storage pond and agree its size after construction begins.', 3, 6, 'Storage can help, but its location, capacity and maintenance need to shape the design early. One pond may not address every flow path.'),
          choice('catchment', 'Assess downstream flows, wetlands and drainage options together before fixing the design.', 8, 10, 'This makes room to compare storage, infiltration and habitat protection across the catchment. The suitable solution depends on local conditions.')
        ]
      },
      {
        id: 'dry-weather', type: 'Water use & drought', title: 'The water estimate leaves a gap',
        copy: 'Cooling figures describe an average year. The wetland is already under pressure in dry summers. What information matters most now?',
        why: 'An annual total can hide seasonal demand. A useful proposal explains its water source, peak use, monitoring and response when supplies are constrained.',
        sources: ['reporting', 'catchments'], best: 'drought', choices: [
          choice('drought', 'Request dry-weather demand, alternative cooling options and clear operating limits.', 8, 10, 'This targets the missing information and allows alternatives to be compared. Limits need clear responsibilities and a way to check compliance.'),
          choice('average', 'Compare the annual total with another campus and accept the lower figure.', -4, 3, 'A comparison is useful only when climate, water source and cooling systems are comparable. A lower annual figure does not resolve drought pressure.'),
          choice('publish', 'Ask the operator to publish monthly water use once the campus opens.', 3, 6, 'Public reporting helps accountability, but the dry-weather risks should also be assessed before the project is committed.')
        ]
      },
      {
        id: 'connected-projects', type: 'Habitat & cumulative effects', title: 'Ten projects share one catchment',
        copy: 'Campus plans show separate access roads and substations. Your group has limited research time. Where should it focus?',
        why: 'The ten campuses are fictional. The lesson is to examine connected pressures: separate planning boundaries do not separate ecological effects.',
        sources: ['habitat', 'energy'], best: 'combined', choices: [
          choice('largest', 'Study the largest campus in detail and leave the smaller ones for later.', 3, 6, 'This is a practical starting point, but several smaller footprints can add up. Record what the narrower study cannot establish.'),
          choice('combined', 'Map shared habitat corridors and seek an assessment of combined infrastructure and demand.', 8, 10, 'A shared map helps reveal gaps between project boundaries. It can support specific questions about siting, connections and total demand.'),
          choice('efficient', 'Prioritise the campus with the best efficiency rating, regardless of location.', -4, 3, 'Efficiency is useful evidence, but it does not describe habitat loss or the total load across all projects. Location and scale also matter.')
        ]
      },
      {
        id: 'wetland-follow-through', type: 'Community & accountability', title: 'Permission includes habitat safeguards',
        copy: 'The revised plan includes wetland buffers and drainage checks. Residents want to know what their next step should be.',
        why: 'A condition is a commitment to follow through. Establish what will be measured, who will publish it and who can act when performance falls short.',
        sources: ['catchments', 'reporting'], best: 'follow', choices: [
          choice('planting', 'Concentrate the remaining funds on a community planting day.', 3, 6, 'A planting day can build participation, but it does not check whether the agreed buffers and drainage measures work. Keep a monitoring role too.'),
          choice('report', 'Rely on the operator’s annual sustainability summary.', -4, 3, 'A summary may provide useful information, but ask for site-specific results against the actual commitments and a clear response to failures.'),
          choice('follow', 'Agree a public monitoring schedule, responsibilities and a route for raising failures.', 8, 10, 'This connects the promises to evidence and action. Ecological recovery can take time, so trends and follow-up matter more than a launch-day claim.')
        ]
      }
    ],
    otter: [
      {
        id: 'prey-warning', type: 'Food webs & evidence', title: 'There are fewer fish downstream',
        copy: 'Residents have seen fewer fish near a campus. The cause is uncertain. What is the most useful first response?',
        why: 'A change in prey is a reason to investigate, not proof of a particular cause. Compare locations, timings and other possible pressures.',
        sources: ['monitoring'], best: 'investigate', choices: [
          choice('investigate', 'Record observations and seek an investigation comparing upstream and downstream conditions.', 8, 10, 'This preserves the warning without claiming a cause too early. Comparable biological and water-quality evidence can guide the next action.'),
          choice('count', 'Organise a fish count at the affected spot before contacting anyone.', 3, 6, 'Local observations can help, but a single place or time offers limited context. Share the concern and ask how to collect useful, safe evidence.'),
          choice('stock', 'Raise funds to add more fish while waiting for the cause to become clear.', -4, 3, 'Adding fish does not resolve the conditions affecting them. Establish the cause and seek appropriate expertise before intervening.')
        ]
      },
      {
        id: 'sediment-pulse', type: 'Pollution & runoff', title: 'The stream clouds after heavy rain',
        copy: 'Cloudy water appears near construction works and farmland. What request would best help identify and reduce the pressure?',
        why: 'Sediment can come from several sources. Timing, rainfall, flow paths and repeated observations help distinguish a pattern from a single incident.',
        sources: ['catchments', 'monitoring'], best: 'trace', choices: [
          choice('photo', 'Publish one photograph and ask the nearest operator to explain it.', 3, 6, 'A dated photograph can start a useful enquiry. Add the location, rainfall context and other observations so the response can be tested.'),
          choice('trace', 'Document the pattern and ask the relevant authority to trace runoff and check controls.', 8, 10, 'This links the concern to investigation and prevention while keeping alternative sources open. Do not enter unsafe water or private works to collect evidence.'),
          choice('dredge', 'Ask for the cloudy reach to be dredged before investigating upstream.', -4, 3, 'Removing material locally may leave the source unchanged and disturb habitat. Establish the cause and assess the effects of any intervention first.')
        ]
      },
      {
        id: 'summer-stress', type: 'Temperature & aquatic life', title: 'A hot week puts the river under stress',
        copy: 'Water levels are low and fish appear distressed. Which proposal best combines immediate scrutiny with longer-term protection?',
        why: 'Heat, flow and oxygen interact. Shade can be helpful, but planting takes time and cannot replace investigating an immediate warning.',
        sources: ['monitoring', 'catchments'], best: 'combined', choices: [
          choice('trees', 'Fund bank-side planting and wait for the trees to provide shade.', 3, 6, 'Shade can be part of a longer-term plan, but trees take time to establish. The current distress still needs prompt investigation.'),
          choice('normal', 'Use last winter’s readings to decide whether extra checks are needed.', -4, 3, 'Winter readings offer context but cannot describe this hot, low-flow period. Conditions should be assessed at the time of concern.'),
          choice('combined', 'Seek prompt checks of temperature, oxygen and flows, alongside a longer-term habitat plan.', 8, 10, 'This addresses the present warning and the conditions that may make it recur. The evidence should guide any operational or habitat response.')
        ]
      },
      {
        id: 'corridor-deadline', type: 'River corridors & participation', title: 'A consultation closes in two weeks',
        copy: 'A new access road may interrupt a sheltered river corridor. A detailed wildlife survey will take longer than the remaining consultation period.',
        why: 'Useful participation states what is known, what remains uncertain and what decision is requested. Check the actual process and deadline for a real proposal.',
        sources: ['habitat', 'catchments'], best: 'submit', choices: [
          choice('submit', 'Submit the existing evidence on time, identify the survey gap and request assessment before a decision.', 8, 10, 'This preserves the opportunity to participate without pretending the evidence is complete. Ask for a connected route and assessment of the proposed crossing.'),
          choice('wait', 'Wait for the completed survey before sending a response.', -4, 3, 'A stronger survey may help later, but waiting can miss this opportunity. Submit the known concerns and be clear about the missing evidence.'),
          choice('petition', 'Focus entirely on a broad petition asking for wildlife protection.', 3, 6, 'A petition can show concern. Pair it with a timely, specific response about the corridor and the decision that needs to change.')
        ]
      },
      {
        id: 'shared-solution', type: 'Community & public benefit', title: 'The community wants jobs and a living river',
        copy: 'Workers want certainty, residents want clean water and the operator offers voluntary safeguards. What should the coalition propose?',
        why: 'A durable coalition can include different needs while still asking for measurable protection. No game choice guarantees a real-world decision or ecological result.',
        sources: ['catchments', 'reporting'], best: 'accountable', choices: [
          choice('voluntary', 'Accept the voluntary package to secure an early agreement.', 3, 6, 'An early agreement may help, but voluntary promises need measurable targets, public reporting and consequences if they are not delivered.'),
          choice('accountable', 'Bring the groups together to test benefit claims and agree measurable, accountable safeguards.', 8, 10, 'This includes people affected by the decision while keeping the evidence and environmental limits in view. Follow-through will still be needed.'),
          choice('separate', 'Let jobs and environmental groups negotiate separately and combine their requests later.', -4, 3, 'Separate discussions can develop expertise, but delaying shared decisions risks conflicting commitments. Identify common evidence and non-negotiable protections early.')
        ]
      }
    ]
  };
  return { sources, characters, challenges };
}));
