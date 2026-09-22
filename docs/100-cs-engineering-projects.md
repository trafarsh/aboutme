# 100 CS Engineering Projects Worth Building

A curated list for a 2nd-year engineering student building a portfolio that survives
technical interview scrutiny. Every entry is filtered against four rules:

1. **No single-tool apps.** If it's one API call wrapped in a form, it's not here.
2. **No clone apps.** No "Netflix clone", no "Uber for X", no todo lists.
3. **Real constraint.** Each project has a physical, economic, or algorithmic constraint
   that makes it genuinely hard — not just "more screens".
4. **Not a re-skin of an existing repo.** Each one has a *hard part* that you cannot
   `git clone` your way out of. That hard part is what you talk about in interviews.

## How to read an entry

- **Tier 1** — buildable in 3–6 weeks at 2nd-year level. Strong resume line.
- **Tier 2** — 2–4 months. Portfolio centerpiece. Needs real design decisions.
- **Tier 3** — semester-scale or research-adjacent. Publishable / hackathon-winning /
  the thing that gets you a referral.

**Hard part** is the sentence to rehearse for interviews. If you can't explain it, you
haven't built the project — you've built the demo.

---

## A. Agriculture, Environment & Climate (1–9)

**1. Pest outbreak forecaster from acoustic traps** — *Tier 2* · `TinyML, ESP32, time-series`
Insect traps that classify wingbeat frequency on-device and report species counts over LoRa.
**Problem:** farmers spray on a calendar, not on evidence — 40% of pesticide is wasted.
**Hard part:** wingbeat signatures overlap between species and drift with temperature; you need on-device MFCC extraction under 200KB RAM plus a drift-correction layer keyed to an onboard thermometer.
**Not a clone:** every public repo does image-based pest ID. Acoustic + edge + drift is unoccupied.

**2. Irrigation scheduler that plans against a forecast, not a threshold** — *Tier 2* · `optimization, MPC, IoT`
**Problem:** soil-moisture-threshold irrigation waters the field an hour before it rains.
**Hard part:** model-predictive control over a 72h probabilistic rain forecast — you're optimizing expected water use under forecast uncertainty, which means the controller must handle a distribution, not a number.
**Not a clone:** 99% of "smart irrigation" projects are `if moisture < 30: pump.on()`.

**3. Crop disease severity *quantification*, not classification** — *Tier 2* · `segmentation, mobile`
**Problem:** "this plant has blight" is useless; "17% leaf area affected, spreading at 3%/day" drives a decision.
**Hard part:** pixel-accurate lesion segmentation on a phone under uncontrolled lighting, plus registering repeat photos of the *same* leaf across days to compute a growth rate.
**Not a clone:** PlantVillage classifiers are a solved, saturated genre. Severity + temporal registration is not.

**4. Groundwater depletion early-warning from well telemetry** — *Tier 2* · `signal processing, geospatial`
**Problem:** borewells fail without warning; a village loses water overnight.
**Hard part:** inferring aquifer drawdown rate from noisy pump-current signatures (no dedicated depth sensor), then spatially interpolating across sparse wells with kriging.
**Not a clone:** turns an existing electrical signal into a hydrological measurement — that reframing is the whole project.

**5. Cold-chain integrity ledger for produce transport** — *Tier 2* · `embedded, crypto, logistics`
**Problem:** India loses ~₹90,000 crore of produce annually; nobody can prove *where* the chain broke.
**Hard part:** tamper-evident logging on a battery-powered device that may be offline for days — hash-chained records with a secure element, plus a reconciliation protocol for out-of-order uploads from multiple handoffs.
**Not a clone:** the crypto is the easy half; the offline-first multi-custody reconciliation is the real engineering.

**6. Satellite-driven crop insurance claim verifier** — *Tier 3* · `remote sensing, geospatial ML`
**Problem:** parametric crop insurance pays out on district averages, so real losses go uncompensated.
**Hard part:** field-boundary delineation from Sentinel-2 at 10m resolution where farms are smaller than a pixel neighbourhood, plus NDVI anomaly detection that separates drought from harvest.
**Not a clone:** the sub-pixel smallholder problem is an actual open research area.

**7. Air quality super-resolution from sparse monitors** — *Tier 3* · `graph NN, spatial stats`
**Problem:** a city of 10 million has 8 monitoring stations; the interpolated map is a lie.
**Hard part:** a graph neural network over a road-network + wind-field graph that predicts PM2.5 at unmonitored nodes, validated by holding out real stations.
**Not a clone:** most AQI projects display an API. This *creates* data that doesn't exist.

**8. Methane plume detection in flare-stack video** — *Tier 3* · `CV, thermal imaging`
**Problem:** fugitive methane is invisible and accounts for a large slice of industrial emissions.
**Hard part:** optical-flow-based detection of near-invisible gas distortion in ordinary IR video, where the signal is a sub-pixel refractive-index shimmer and the noise is heat haze.
**Not a clone:** requires building your own labelling pipeline — there's no clean dataset.

**9. Microclimate-aware urban tree placement planner** — *Tier 2* · `simulation, optimization, GIS`
**Problem:** cities plant trees where there's space, not where heat kills people.
**Hard part:** coupling a simplified radiative-transfer heat model with a submodular-maximization placement solver under budget and species-survival constraints.
**Not a clone:** joins a physics simulation to a combinatorial optimizer — neither half exists off the shelf for this.

---

## B. Healthcare & Biomedical (10–18)

**10. Stethoscope-to-phone murmur triage for rural clinics** — *Tier 2* · `DSP, audio ML, embedded`
**Problem:** 65% of India's population, 33% of its doctors. Valvular disease goes undiagnosed until it's surgical.
**Hard part:** a ₹500 analog front-end (op-amp + electret) whose frequency response you must *characterize and compensate for in software* before any model will generalize off your own hardware.
**Not a clone:** the hardware-characterization step is what every audio-ML repo skips, and it's why they don't transfer.

**11. Medication adherence from pill-bottle inertial signatures** — *Tier 2* · `TinyML, sensor fusion`
**Problem:** non-adherence causes more hospitalizations than most drugs prevent.
**Hard part:** distinguishing "opened and took a pill" from "moved the bottle" using only a 6-axis IMU at <1mA average draw — a joint classification + power-budgeting problem.
**Not a clone:** the power budget is the constraint that makes it engineering rather than modelling.

**12. Retinal image quality gatekeeper for screening camps** — *Tier 2* · `CV, deployment`
**Problem:** ~20% of tele-ophthalmology images are ungradable; the patient has already gone home.
**Hard part:** a real-time on-device gradability model that must have near-zero false-*accept* rate, forcing you to actually do threshold selection against an asymmetric cost matrix.
**Not a clone:** solves the workflow problem, not the diagnosis problem — far rarer and more useful.

**13. ICU alarm fatigue reducer** — *Tier 3* · `time-series, causal inference`
**Problem:** 85–99% of ICU alarms are false; nurses stop responding.
**Hard part:** multi-signal corroboration to suppress artifact alarms, evaluated with a *harm-weighted* metric where one missed true alarm outweighs thousands of suppressions.
**Not a clone:** the evaluation design is the intellectual content. Use MIMIC-IV.

**14. Gait-based fall risk from a single waist sensor** — *Tier 2* · `signal processing, embedded`
**Problem:** falls are the leading injury death in the elderly; risk scoring needs a gait lab.
**Hard part:** extracting clinically validated gait parameters (stride variability, double-support time) from one noisy accelerometer, then validating against an actual clinical scale.
**Not a clone:** most fall projects *detect* falls after the fact. Predicting risk beforehand is the valuable one.

**15. Antibiotic resistance trend miner from lab reports** — *Tier 2* · `NLP, IE, epidemiology`
**Problem:** hospitals hold antibiogram data in PDFs; nobody aggregates regional resistance trends.
**Hard part:** information extraction from wildly non-standard lab report layouts, plus entity resolution across organism-naming conventions — then privacy-preserving aggregation.
**Not a clone:** messy real-document IE is the opposite of a Kaggle CSV.

**16. Prosthetic grip intent from forearm EMG** — *Tier 3* · `biosignals, real-time ML`
**Problem:** commercial myoelectric hands offer 2 grips; users want 8.
**Hard part:** the classifier must survive electrode shift between donnings — you need domain adaptation or an explicit recalibration protocol, and <150ms end-to-end latency or the hand feels dead.
**Not a clone:** electrode shift is the documented reason academic EMG results don't reach users.

**17. Vaccine cold-chain route planner under outage risk** — *Tier 2* · `stochastic optimization`
**Problem:** last-mile vaccine spoilage in regions with unreliable power.
**Hard part:** a vehicle routing problem with stochastic node availability — you're optimizing expected doses delivered, not distance, which breaks standard VRP solvers.
**Not a clone:** the objective function reframing is the project.

**18. Sign-language *continuous* translation, not alphabet spelling** — *Tier 3* · `CV, sequence models`
**Problem:** every student sign-language project classifies 26 static letters. Deaf people don't fingerspell sentences.
**Hard part:** continuous sign recognition needs sequence alignment (CTC/transducer) over co-articulated signs plus non-manual markers (facial grammar) that carry syntax.
**Not a clone:** this is precisely the project everyone does badly — doing it right is a differentiator.

---
## C. Energy, Grid & Sustainability (19–27)

**19. Non-intrusive load monitoring for a single-phase home meter** — *Tier 3* · `signal separation, ML`
**Problem:** "your bill is ₹4,000" doesn't change behaviour; "your geyser costs ₹1,100" does.
**Hard part:** energy disaggregation from one aggregate current waveform — a blind source separation problem where appliances have overlapping signatures and multi-state behaviour.
**Not a clone:** a genuine research problem (NILM) with a real benchmark (REDD/UK-DALE) to beat.

**20. Rooftop solar yield predictor using shadow simulation** — *Tier 2* · `3D geometry, CV`
**Problem:** installers quote yield from panel area and ignore the neighbour's water tank.
**Hard part:** reconstructing rooftop obstruction geometry from a phone panorama or satellite tile, then ray-tracing sun paths across a year to produce an hourly shading loss map.
**Not a clone:** couples photogrammetry to a solar-geometry model — neither is a library call.

**21. EV charging scheduler that respects transformer limits** — *Tier 2* · `distributed optimization`
**Problem:** a street of EVs charging at 7pm melts the local distribution transformer.
**Hard part:** decentralized scheduling where vehicles negotiate a shared power envelope without a central authority — an ADMM or auction mechanism with fairness guarantees.
**Not a clone:** the mechanism design (nobody can game it by lying about urgency) is the hard part.

**22. Battery state-of-health estimator from partial charge cycles** — *Tier 3* · `physics-informed ML`
**Problem:** SoH estimation needs a full discharge cycle; real users never give you one.
**Hard part:** incremental capacity analysis on fragmentary charge segments, blending an equivalent-circuit model with a learned residual so it extrapolates instead of memorizing.
**Not a clone:** physics-informed hybrids are exactly what battery and EV teams hire for.

**23. Grid frequency anomaly detector from a ₹300 sensor** — *Tier 2* · `DSP, distributed systems`
**Problem:** grid stress events are invisible to consumers and under-instrumented.
**Hard part:** measuring mains frequency to ±5mHz from a cheap opto-isolated zero-crossing detector, which requires careful timer capture and clock-drift compensation on the MCU.
**Not a clone:** a precision-measurement problem solved in firmware, not a dashboard.

**24. Building HVAC setpoint optimizer with occupancy inference** — *Tier 2* · `RL / MPC, sensor fusion`
**Problem:** buildings cool empty rooms; HVAC is ~40% of commercial energy.
**Hard part:** inferring occupancy from CO₂ decay curves (no cameras, privacy-preserving) and feeding it into a thermal-mass model with pre-cooling — control with a slow, delayed plant.
**Not a clone:** CO₂-based occupancy inference is a neat inverse problem and the privacy story is a real selling point.

**25. Carbon-aware job scheduler for compute clusters** — *Tier 2* · `systems, forecasting`
**Problem:** the same training run emits 3× more CO₂ depending on when it runs.
**Hard part:** scheduling deferrable jobs against a forecast of grid carbon intensity under deadline SLAs — an online decision problem with uncertain future prices.
**Not a clone:** integrates with real schedulers (Slurm/K8s) which is a systems skill, not a scripting one.

**26. Micro-hydro turbine MPPT controller** — *Tier 2* · `power electronics, control, embedded`
**Problem:** small hydro installs run far off their max power point as flow varies.
**Hard part:** a perturb-and-observe / extremum-seeking controller on a plant with large mechanical inertia, where the naive algorithm oscillates and loses more than it gains.
**Not a clone:** real control theory on real hardware — directly relevant to your EEE degree.

**27. Distribution-network fault localization from smart meter voltage sags** — *Tier 3* · `graph algorithms, estimation`
**Problem:** a rural feeder fault takes hours to locate by driving the line.
**Hard part:** inverting sag magnitudes observed at leaf nodes back to a fault location on an imperfectly-known network topology — you must estimate the topology too.
**Not a clone:** a joint topology + fault estimation problem with a clean graph formulation.

---

## D. Mobility, Motorsport & Automotive (28–37)

**28. Go-kart telemetry stack with on-track anomaly detection** — *Tier 2* · `CAN/embedded, streaming`
**Problem:** kart teams debug failures after they happen, from memory.
**Hard part:** a hard-real-time logger sampling multiple channels with coherent timestamps over a lossy radio link, plus online change-point detection that flags a developing fault mid-session.
**Not a clone:** directly leverages your Kurukshetra Racing access — data nobody else on the internet has.

**29. Lap-time optimal racing line solver for an arbitrary track** — *Tier 3* · `optimal control, vehicle dynamics`
**Problem:** drivers learn the line by repetition; simulation should give it in minutes.
**Hard part:** minimum-lap-time optimization over a curvilinear track model with a tyre friction ellipse — a nonlinear optimal control problem that needs real transcription (direct collocation), not a heuristic.
**Not a clone:** serious vehicle dynamics. This alone gets you motorsport and robotics interviews.

**30. Driver behaviour scoring from phone sensors alone** — *Tier 2* · `sensor fusion, ML`
**Problem:** telematics insurance needs a dongle; phones are already in every car.
**Hard part:** the phone's orientation is unknown and changes — you must estimate the vehicle frame from motion itself before any acceleration event is meaningful.
**Not a clone:** the frame-estimation step is where every naive implementation fails.

**31. Pothole severity mapper via crowdsourced suspension response** — *Tier 2* · `signal processing, geospatial`
**Problem:** road maintenance is reactive and complaint-driven.
**Hard part:** normalizing vertical acceleration across different vehicles, speeds, and phone mountings so that severity is comparable — a calibration problem across an uncontrolled fleet.
**Not a clone:** cross-device normalization is the reason existing pothole apps produce garbage.

**32. Bus bunching predictor and headway controller** — *Tier 2* · `time-series, control`
**Problem:** buses bunch; riders wait 25 minutes then see three at once.
**Hard part:** predicting bunching 15 minutes ahead and computing holding times that fix it without wrecking total travel time — a feedback control problem on a ring of vehicles.
**Not a clone:** offers a *control action*, not a live-tracking map.

**33. Motorcycle blind-spot radar with haptic mirror feedback** — *Tier 2* · `mmWave/ultrasonic, embedded`
**Problem:** two-wheelers dominate Indian roads and have the worst rear awareness.
**Hard part:** false-positive suppression when the road surface, guardrails and lane-splitting traffic all return echoes — tracking with gating, not raw thresholding.
**Not a clone:** a clutter-rejection problem; a bare sensor read is useless here.

**34. Rider crash detection that survives potholes** — *Tier 2* · `TinyML, embedded`
**Problem:** generic crash detection fires constantly on Indian roads, so people disable it.
**Hard part:** separating a real impact from a severe pothole using post-event *attitude* evolution, not just peak-g — the discriminating feature is what happens in the 2 seconds after.
**Not a clone:** the post-event window insight is a genuinely non-obvious design decision.

**35. Traffic signal timing optimizer from CCTV counts** — *Tier 3* · `CV, RL, simulation`
**Problem:** fixed-time signals waste enormous aggregate time.
**Hard part:** you can't train RL on a live intersection, so you must build a calibrated SUMO microsimulation from real counts and prove sim-to-real transfer.
**Not a clone:** the calibration/transfer story is the whole intellectual content.

**36. Range anxiety router with terrain and HVAC load** — *Tier 2* · `graph algorithms, energy modelling`
**Problem:** EV range estimates ignore elevation, payload and air-conditioning.
**Hard part:** shortest path over an energy metric that can be *negative* (regenerative braking downhill) with a state-of-charge constraint — plain Dijkstra breaks; you need a resource-constrained variant.
**Not a clone:** a genuinely interesting algorithms problem hiding in a practical app.

**37. Vehicle CAN bus intrusion detector** — *Tier 3* · `security, embedded, anomaly detection`
**Problem:** CAN has no authentication; injected frames are indistinguishable from real ones.
**Hard part:** fingerprinting ECUs by clock-skew in message timing so you can detect a *spoofed* frame from a legitimate arbitration ID.
**Not a clone:** a well-founded technique that's rarely implemented well by students.

---
## E. Manufacturing, CAD & Industrial (38–46)

**38. Parametric design-space explorer with automated FEA sweeps** — *Tier 3* · `CAD scripting, simulation, optimization`
**Problem:** engineers hand-tweak one design at a time and call the first feasible one "optimal".
**Hard part:** a pipeline that generates geometry (CadQuery), meshes it, runs FEA, and feeds results to a Bayesian optimizer — with automatic recovery when meshing fails, which it constantly will.
**Not a clone:** robustness to mid-pipeline geometry failure is the real engineering, and it maps straight onto your chassis generator.

**39. Manufacturability checker for weldments** — *Tier 2* · `computational geometry, CAD`
**Problem:** designs reach the shop floor with joints no torch can reach.
**Hard part:** torch-accessibility analysis — swept-volume collision testing of a tool envelope against the assembly, i.e. real computational geometry.
**Not a clone:** DFM tools are commercial and closed; a focused open one is genuinely novel.

**40. Tool wear prediction from spindle acoustics** — *Tier 2* · `DSP, ML, industrial`
**Problem:** CNC tools are replaced on a fixed schedule — too early (waste) or too late (scrapped part).
**Hard part:** the wear signal lives in spectral sidebands that shift with RPM and material, so features must be order-normalized rather than frequency-normalized.
**Not a clone:** order tracking is a specific rotating-machinery technique that distinguishes real work from a generic FFT.

**41. Vision-based dimensional QC without a calibration jig** — *Tier 2* · `camera calibration, CV`
**Problem:** small workshops can't afford CMMs or fixed vision rigs.
**Hard part:** metric measurement from a handheld phone requires solving pose from a known fiducial and propagating calibration uncertainty into a stated tolerance — a measurement without an error bar is not a measurement.
**Not a clone:** uncertainty propagation is the part that makes it credible to an actual manufacturer.

**42. Nesting optimizer for sheet metal cutting** — *Tier 2* · `combinatorial optimization, geometry`
**Problem:** poor nesting wastes 15–30% of expensive sheet.
**Hard part:** irregular 2D bin packing with rotation and common-line cutting — NP-hard, needs no-fit-polygon geometry plus a good metaheuristic.
**Not a clone:** a classic hard problem where you can measure yourself against published benchmarks.

**43. Predictive maintenance for a single motor you instrument yourself** — *Tier 2* · `vibration analysis, embedded`
**Problem:** most "predictive maintenance" projects use a pre-labelled bearing dataset and learn nothing.
**Hard part:** you must *induce* faults on real hardware and collect your own labelled data, then show envelope-spectrum bearing-defect frequencies actually appear.
**Not a clone:** self-collected data is explicitly what recruiters cite as the differentiator.

**44. BOM diff and change-impact tracker across CAD revisions** — *Tier 2* · `parsing, graph, tooling`
**Problem:** a fastener change silently invalidates three downstream sub-assemblies.
**Hard part:** structural diffing of hierarchical BOMs where part IDs get renumbered — a tree-edit-distance / graph-matching problem, not a text diff.
**Not a clone:** the renumbering problem defeats every naive approach.

**45. Assembly instruction generator from a CAD tree** — *Tier 3* · `geometry, planning`
**Problem:** assembly documentation is drawn by hand and goes stale immediately.
**Hard part:** deriving a feasible assembly *order* from geometry — a disassembly-planning search over blocked-directions graphs.
**Not a clone:** a real robotics/CAD planning problem with a satisfying visual payoff.

**46. Digital twin of a lab process with online parameter estimation** — *Tier 3* · `simulation, estimation`
**Problem:** simulations are built once and then diverge from reality forever.
**Hard part:** continuously re-fitting model parameters from live sensor data (EKF / recursive least squares) so the twin tracks the plant as it ages.
**Not a clone:** "digital twin" is usually a buzzword for a 3D viewer. The estimation loop is what makes it one.

---

## F. Developer Tools, Compilers & Systems (47–57)

**47. Flaky test detector that finds the *cause*, not the flake** — *Tier 3* · `program analysis, CI`
**Problem:** teams rerun flaky tests forever instead of fixing them.
**Hard part:** classifying flakiness root cause (order dependence, timing, shared state) by controlled re-execution under perturbed schedules and shuffled orders.
**Not a clone:** the systematic perturbation harness is the contribution; detection alone is trivial.

**48. Incremental build graph for a polyglot monorepo** — *Tier 3* · `build systems, graph`
**Problem:** CI rebuilds everything because nobody can compute what actually changed.
**Hard part:** deriving a true file-level dependency graph across language boundaries via syscall tracing of a single clean build, then using it to prune subsequent builds.
**Not a clone:** syscall-traced dependency discovery is how real build tools work and almost nobody implements it.

**49. Query planner visualizer that explains *why* a plan was chosen** — *Tier 2* · `databases, viz`
**Problem:** `EXPLAIN` tells you the plan, never the rejected alternatives or the cost model's reasoning.
**Hard part:** instrumenting or reimplementing the cost-based enumeration so you can surface the search space and the cardinality estimate that led it astray.
**Not a clone:** teaching tool + real database internals; excellent interview material.

**50. Memory allocator tuned for a specific workload** — *Tier 3* · `systems, C, profiling`
**Problem:** general-purpose allocators are a compromise nobody measures.
**Hard part:** building a size-class/arena allocator and proving a win with rigorous benchmarking — including fragmentation over time, not just throughput on a microbenchmark.
**Not a clone:** benchmark methodology is where most such projects are worthless; doing it honestly is the skill.

**51. Regex engine with linear-time guarantees** — *Tier 2* · `automata, compilers`
**Problem:** backtracking regex engines are a live DoS vector (ReDoS) in production systems.
**Hard part:** Thompson NFA simulation with a lazily-constructed DFA cache, plus submatch extraction which is the genuinely hard part of the linear-time approach.
**Not a clone:** a canonical "did you actually understand automata theory" project.

**52. Time-travel debugger for a small VM** — *Tier 3* · `interpreters, systems`
**Problem:** stepping backwards is the debugging feature everyone wants and almost nobody has.
**Hard part:** efficient reverse execution via periodic snapshots plus deterministic replay — naive full-state recording explodes in memory immediately.
**Not a clone:** the snapshot/replay tradeoff is a real systems design decision.

**53. Static analyzer for a domain rule your team actually has** — *Tier 2* · `AST, program analysis`
**Problem:** code review catches architectural violations inconsistently or not at all.
**Hard part:** dataflow analysis (not pattern matching) to track whether tainted values reach a forbidden sink, with a false-positive rate low enough that people keep it on.
**Not a clone:** the FP-rate constraint forces real analysis rather than regex-on-source.

**54. Deterministic simulation testing harness for a distributed system** — *Tier 3* · `distributed systems, testing`
**Problem:** distributed bugs appear once in production and never reproduce.
**Hard part:** making time, scheduling, and network I/O injectable so an entire cluster runs deterministically in one thread under a seed — then fuzzing the seed space.
**Not a clone:** this is FoundationDB-grade methodology; implementing it credibly at small scale is a huge signal.

**55. Language server for a small DSL, with incremental reparsing** — *Tier 2* · `parsers, LSP`
**Problem:** DSLs proliferate and all have terrible tooling.
**Hard part:** error-tolerant incremental parsing — the editor's buffer is syntactically invalid most of the time, so the parser must keep producing a usable tree anyway.
**Not a clone:** error recovery is the difference between a toy parser and a real one.

**56. Package dependency resolver with real SAT solving** — *Tier 2* · `SAT, algorithms`
**Problem:** version resolution conflicts produce famously unhelpful errors.
**Hard part:** encoding version constraints into SAT/PubGrub and — harder — extracting a *human-readable explanation* of an unsatisfiable core.
**Not a clone:** explanation generation is the genuinely unsolved usability problem.

**57. Observability tracer that samples adaptively under load** — *Tier 3* · `distributed systems, statistics`
**Problem:** head-based sampling drops precisely the rare slow traces you need.
**Hard part:** tail-based sampling requires buffering spans across services until a trace completes, with bounded memory and a biased-but-correctable sampling estimator.
**Not a clone:** the statistical correction (so aggregate metrics stay unbiased) is the part everyone gets wrong.

---
## G. Distributed Systems & Databases (58–66)

**58. Raft implementation with a real membership-change protocol** — *Tier 3* · `consensus, systems`
**Problem:** most student Raft stops at leader election; joint consensus is where it gets real.
**Hard part:** dynamic membership changes without losing safety during the transition, verified by a test suite that partitions the cluster mid-reconfiguration.
**Not a clone:** the verification harness is what separates this from copying the paper's pseudocode.

**59. CRDT-backed collaborative editor with offline merge** — *Tier 2* · `CRDTs, distributed`
**Problem:** collaborative tools break badly when someone edits offline for a day.
**Hard part:** an RGA/Yjs-style sequence CRDT where tombstone growth is bounded — garbage collection in a CRDT is the genuinely hard open-ended part.
**Not a clone:** everyone imports Yjs. Implementing the sequence CRDT and its GC is the project.

**60. Time-series store with a custom compression codec** — *Tier 3* · `storage engines, compression`
**Problem:** sensor data volume outruns naive storage by orders of magnitude.
**Hard part:** implementing Gorilla-style delta-of-delta + XOR float compression and a columnar block layout, then measuring compression ratio *and* query latency against a real workload.
**Not a clone:** pairs beautifully with your own telemetry projects as a data source.

**61. Geo-distributed rate limiter with bounded inconsistency** — *Tier 2* · `distributed algorithms`
**Problem:** a global rate limit across regions either needs a round trip per request or over-admits.
**Hard part:** a distributed token bucket that trades a provable over-admission bound against sync frequency — you must state and defend the bound.
**Not a clone:** a crisp consistency/latency tradeoff you can quantify.

**62. Write-ahead-log storage engine with crash-consistency fuzzing** — *Tier 3* · `storage, testing`
**Problem:** "it survives crashes" is asserted far more often than tested.
**Hard part:** a fault-injection layer that simulates torn writes and reordered fsyncs, then verifies every recovery point is a valid state.
**Not a clone:** crash-consistency fuzzing is rare, rigorous, and extremely hireable.

**63. Streaming join engine with watermarks and late data** — *Tier 3* · `stream processing`
**Problem:** real event streams arrive late and out of order; naive windowing silently drops them.
**Hard part:** watermark generation and allowed-lateness semantics, with state cleanup that doesn't leak memory over a long-running job.
**Not a clone:** correct event-time semantics is where most streaming implementations quietly fail.

**64. Vector index built from scratch with recall/latency curves** — *Tier 2* · `ANN algorithms`
**Problem:** everyone calls a vector DB; almost nobody understands the recall tradeoff they accepted.
**Hard part:** implementing HNSW or IVF-PQ and producing honest recall-vs-latency Pareto curves against brute force on a real corpus.
**Not a clone:** the benchmark rigor is the deliverable, and it's directly relevant to every AI team.

**65. Multi-tenant fair scheduler with priority inversion prevention** — *Tier 3* · `scheduling, systems`
**Problem:** one noisy tenant starves everyone else.
**Hard part:** weighted fair queueing with an aging mechanism, proven against adversarial workloads you design specifically to break your own scheduler.
**Not a clone:** adversarial self-testing is the mark of a systems engineer.

**66. Edge-to-cloud sync protocol for intermittently connected devices** — *Tier 2* · `distributed, embedded`
**Problem:** field devices in low-connectivity regions lose or duplicate data constantly.
**Hard part:** idempotent, resumable, bandwidth-adaptive sync with conflict resolution — designed for a device that may reboot mid-transfer with a half-written buffer.
**Not a clone:** directly needed by half the agriculture and health projects in this list.

---

## H. Applied ML & ML Systems Infrastructure (67–77)

**67. Model drift monitor that alerts before accuracy drops** — *Tier 2* · `MLOps, statistics`
**Problem:** you discover drift when a customer complains, months late.
**Hard part:** detecting covariate shift without labels — population stability, MMD tests, and calibrating a threshold that doesn't cry wolf weekly.
**Not a clone:** unlabelled drift detection is the actual production problem.

**68. Active learning loop for a dataset you label yourself** — *Tier 2* · `ML, annotation`
**Problem:** labelling is the real cost of every ML project and nobody budgets for it.
**Hard part:** an acquisition function plus a *measured* comparison showing you reached target accuracy with meaningfully fewer labels than random sampling.
**Not a clone:** demonstrating a labelling-efficiency win with numbers is rare and persuasive.

**69. Quantization-aware deployment pipeline with accuracy accounting** — *Tier 2* · `edge ML, optimization`
**Problem:** INT8 quantization silently destroys accuracy on the classes that matter.
**Hard part:** per-layer sensitivity analysis to find a mixed-precision assignment hitting a latency target with minimum accuracy loss — a constrained search, not a flag.
**Not a clone:** straight to the core of edge-AI work, which is a growing hiring area.

**70. Retrieval evaluation harness that catches retrieval failures** — *Tier 2* · `IR, evaluation`
**Problem:** RAG systems fail at retrieval, but everyone only evaluates the generated answer.
**Hard part:** building a component-wise eval with your own annotated relevance judgments, separating retrieval failures from generation failures.
**Not a clone:** the vast majority of RAG projects have no evaluation at all.

**71. Small-model distillation for a narrow task with a latency budget** — *Tier 2* · `ML, efficiency`
**Problem:** calling a large model for a simple classification is slow and expensive.
**Hard part:** distilling into a model that fits a stated latency/memory budget while proving parity on a held-out set — and characterizing exactly where it degrades.
**Not a clone:** the failure-mode characterization is what makes it trustworthy.

**72. Feature store with point-in-time correctness** — *Tier 3* · `ML infra, databases`
**Problem:** training/serving skew from label leakage is the most common silent ML bug.
**Hard part:** point-in-time-correct joins so a training row only ever sees features available *at that timestamp* — a temporal join with real subtlety.
**Not a clone:** correctly identifying and solving leakage marks you as production-ready.

**73. Synthetic data generator with a privacy guarantee** — *Tier 3* · `privacy, generative models`
**Problem:** useful datasets can't be shared; anonymization is repeatedly shown to fail.
**Hard part:** training under differential privacy (DP-SGD) and reporting the actual ε alongside a utility measurement — the privacy/utility curve is the deliverable.
**Not a clone:** stating a real ε rather than hand-waving "it's anonymized" is the differentiator.

**74. Continual learning system that doesn't catastrophically forget** — *Tier 3* · `ML research`
**Problem:** deployed models retrained on new data lose old capabilities.
**Hard part:** rehearsal or regularization strategies under a *fixed memory budget*, evaluated on a task sequence with backward-transfer metrics.
**Not a clone:** a real open research problem with established benchmarks.

**75. Label-noise-robust training on a deliberately dirty dataset** — *Tier 2* · `ML`
**Problem:** real labels are 5–20% wrong; clean benchmarks hide this entirely.
**Hard part:** noise-robust losses plus a confident-learning pass that identifies suspected mislabels — then manually verifying them to prove the method actually found real errors.
**Not a clone:** the manual verification step turns a claim into evidence.

**76. Inference server with request batching and tail-latency SLOs** — *Tier 3* · `ML systems, performance`
**Problem:** naive serving either wastes GPU or blows p99 latency.
**Hard part:** dynamic batching with an adaptive window that optimizes throughput subject to a p99 constraint — a queueing-theory problem with real measurements.
**Not a clone:** p99 thinking (not mean latency) is a senior-engineer signal.

**77. Counterfactual explanation generator for a rejection decision** — *Tier 2* · `interpretable ML`
**Problem:** "loan denied" without a reason is unhelpful and in many jurisdictions illegal.
**Hard part:** generating *actionable* counterfactuals — minimal changes that are feasible (you can't change your age) and respect feature correlations.
**Not a clone:** the feasibility constraints are what make it useful rather than a gradient trick.

---
## I. Security, Privacy & Trust (78–85)

**78. Supply-chain attestation for a small build pipeline** — *Tier 2* · `security, build systems`
**Problem:** you cannot prove the binary you shipped came from the source you reviewed.
**Hard part:** reproducible builds — eliminating every source of nondeterminism (timestamps, paths, ordering, locale) until two independent builds are bit-identical.
**Not a clone:** bit-for-bit reproducibility is a grind that demonstrates exceptional rigor.

**79. Firmware update system with rollback and anti-rollback** — *Tier 3* · `embedded security`
**Problem:** a bad OTA bricks a deployed fleet; a rollback-able one lets attackers restore known-vulnerable firmware.
**Hard part:** A/B partitioning with signature verification and a monotonic version counter in fuses — tolerating power loss at *any* instant during the update.
**Not a clone:** power-fail-safe update logic is what real device companies interview on.

**80. Side-channel leak detector for a crypto implementation** — *Tier 3* · `security, statistics`
**Problem:** constant-time code is claimed far more often than verified.
**Hard part:** statistical timing analysis (TVLA / Welch's t-test) over many traces to detect data-dependent timing — you must handle measurement noise properly.
**Not a clone:** measurement methodology is the whole project; the attack itself is textbook.

**81. Privacy-preserving analytics with local differential privacy** — *Tier 2* · `privacy, statistics`
**Problem:** usage analytics require collecting data that shouldn't leave the device.
**Hard part:** randomized response / RAPPOR-style encoding on-device plus an unbiased server-side estimator, with honest error bars as a function of ε and population size.
**Not a clone:** the estimator and its variance analysis are real statistics.

**82. Phishing detector for regional-language SMS** — *Tier 2* · `NLP, security`
**Problem:** scam SMS in Tamil/Hindi/transliterated text evades English-trained filters entirely.
**Hard part:** code-mixed, transliterated text with no standard orthography — the same word has a dozen spellings, so you need subword or character-level modelling plus your own collected corpus.
**Not a clone:** an underserved language problem with data you must gather yourself.

**83. Deepfake audio detector for voice-call scams** — *Tier 3* · `audio forensics`
**Problem:** voice-cloning scams targeting families are growing fast.
**Hard part:** detection must survive phone-codec compression, which destroys exactly the high-frequency artifacts most detectors rely on — so you need codec-robust features.
**Not a clone:** the codec-robustness constraint is what makes it deployable rather than academic.

**84. Consent and data-flow mapper for a codebase** — *Tier 2* · `static analysis, privacy`
**Problem:** nobody can answer "where does this user's email actually go?"
**Hard part:** inter-procedural taint tracking from PII sources to network/log sinks across module boundaries.
**Not a clone:** combines compiler technique with a compliance problem companies genuinely have.

**85. Hardware-rooted device identity for cheap IoT** — *Tier 3* · `embedded security`
**Problem:** IoT devices ship with shared keys and are trivially cloned.
**Hard part:** deriving a stable per-device key from SRAM start-up state (a PUF), which requires error correction — the raw PUF response is noisy on every boot.
**Not a clone:** PUF fuzzy extractors are elegant and rarely implemented by students.

---

## J. Accessibility, Civic Tech & Public Infrastructure (86–93)

**86. Indoor navigation for blind users without beacons** — *Tier 3* · `sensor fusion, CV`
**Problem:** GPS stops at the door; beacon infrastructure doesn't exist anywhere.
**Hard part:** pedestrian dead reckoning drifts badly; you need visual landmark recognition to correct it, plus turn-by-turn guidance designed for audio-only delivery.
**Not a clone:** the drift-correction loop and audio UX are both substantial, under-explored design problems.

**87. Screen-reader-quality document structure recovery from PDFs** — *Tier 2* · `document AI, accessibility`
**Problem:** government and academic PDFs are untagged and unreadable by screen readers.
**Hard part:** inferring reading order and heading hierarchy from pure visual layout in multi-column documents with footnotes and tables.
**Not a clone:** reading-order inference is an unsolved document-AI problem with immediate human impact.

**88. Real-time captioning tuned for Indian-accented technical speech** — *Tier 2* · `ASR, fine-tuning`
**Problem:** generic ASR mangles accented lecture speech full of domain jargon.
**Hard part:** domain adaptation with a custom lexicon and shallow-fusion LM biasing, evaluated with WER *on the jargon terms specifically* — overall WER hides the failures that matter.
**Not a clone:** the targeted evaluation metric is the insight.

**89. Public budget document diff and anomaly explorer** — *Tier 2* · `data engineering, NLP`
**Problem:** budgets are published as PDFs designed to be unreadable; changes go unnoticed.
**Hard part:** table extraction across years with inconsistent line-item naming, requiring entity resolution before any year-over-year comparison is meaningful.
**Not a clone:** the reconciliation across schema changes is the hard, valuable part.

**90. Grievance routing from free-text citizen complaints** — *Tier 2* · `NLP, ops research`
**Problem:** complaints go to the wrong department and die there.
**Hard part:** multi-label classification over a long-tail, evolving taxonomy, plus routing that accounts for departmental load — so classification quality is measured by *resolution time*, not F1.
**Not a clone:** tying the ML metric to the operational outcome is what most projects never do.

**91. Flood inundation predictor from local rainfall and drain telemetry** — *Tier 3* · `hydrology, simulation`
**Problem:** urban flooding is predictable hours ahead but nobody publishes street-level warnings.
**Hard part:** coupling a simplified hydraulic model to a DEM, calibrated against crowdsourced observed flood depths.
**Not a clone:** the calibration against messy citizen reports is a real inverse problem.

**92. Ration/entitlement eligibility explainer as executable policy** — *Tier 2* · `rules engines, formal methods`
**Problem:** people don't claim benefits because eligibility rules are impenetrable.
**Hard part:** encoding legal rules as a verifiable decision structure that produces a *traceable justification* per decision, and detecting contradictions between rules.
**Not a clone:** rules-as-code with contradiction detection is an emerging civic-tech field.

**93. Crowdsourced accessibility audit of physical spaces** — *Tier 2* · `CV, geospatial, mobile`
**Problem:** wheelchair users have no reliable data on ramps, kerb cuts, or usable toilets.
**Hard part:** verifying crowdsourced claims — a trust/reputation model plus CV validation of submitted photos to resist both noise and abuse.
**Not a clone:** the trust layer is what distinguishes this from an empty map.

---

## K. Robotics, Drones & Spatial Computing (94–100)

**94. SLAM on a sub-₹5,000 sensor budget** — *Tier 3* · `SLAM, robotics`
**Problem:** SLAM results assume expensive LiDAR; hobby robotics can't.
**Hard part:** visual-inertial odometry on a rolling-shutter camera, which violates the global-shutter assumption every standard VIO pipeline makes — you must model it.
**Not a clone:** confronting the rolling-shutter problem head-on is a genuine contribution.

**95. Autonomous warehouse multi-robot path planner** — *Tier 3* · `MAPF, algorithms`
**Problem:** multi-robot coordination deadlocks the moment you scale past a handful.
**Hard part:** multi-agent pathfinding (CBS or a priority scheme) with guaranteed deadlock freedom in narrow corridors — and it must replan online as tasks arrive.
**Not a clone:** MAPF is a rich algorithmic area with real benchmarks to compare against.

**96. Drone-based powerline inspection with fault localization** — *Tier 3* · `CV, geospatial, robotics`
**Problem:** line inspection is done by helicopter or on foot.
**Hard part:** detecting small defects (broken strands, cracked insulators) in imagery where the defect is a few pixels, plus georegistering each detection precisely enough to send a crew.
**Not a clone:** the small-object-detection + precise-localization combination is the engineering.

**97. Tactile slip detection for robotic grasping** — *Tier 3* · `sensors, control`
**Problem:** robots either crush objects or drop them; they don't modulate grip.
**Hard part:** detecting incipient slip from vibration signatures within a few milliseconds and closing a grip-force control loop before the object actually falls.
**Not a clone:** a tight real-time sense-act loop where latency is the design constraint.

**98. AR measurement tool with stated accuracy bounds** — *Tier 2* · `AR, computer vision`
**Problem:** AR rulers are confidently wrong and never say by how much.
**Hard part:** propagating tracking uncertainty into a displayed confidence interval, and detecting when tracking quality has degraded enough that the measurement should be refused.
**Not a clone:** admitting and quantifying uncertainty is the differentiator over every existing AR ruler.

**99. Swarm coordination under intermittent communication** — *Tier 3* · `distributed robotics`
**Problem:** swarm demos assume reliable communication; real fields don't have it.
**Hard part:** consensus on task allocation that degrades gracefully into independent operation and re-merges without duplicating work when links return.
**Not a clone:** the partition-tolerance requirement makes it a distributed systems problem wearing a robotics hat.

**100. Sim-to-real transfer for a controller you actually deploy** — *Tier 3* · `RL, control, robotics`
**Problem:** RL controllers that work in simulation fail immediately on hardware.
**Hard part:** domain randomization plus system identification, with an honest report of the reality gap — including the failures, not just the successful run.
**Not a clone:** publishing the gap rather than hiding it is the most credible thing on this entire list.

---
## If you only build six: a shortlist for *your* profile

You're EEE, you have hardware access, you're on a racing team, and you already do
CAD scripting and full-stack. That combination is rare — most CS students cannot
touch the hardware half of this list. Lean into it rather than competing on web apps.

A portfolio of 4–6 deep projects beats 30 shallow ones. Suggested spine:

| # | Project | Why it fits you |
|---|---------|-----------------|
| 28 | Go-kart telemetry + anomaly detection | You have the kart. Nobody else has this data. |
| 29 | Lap-time optimal racing line solver | Pairs with #28; real optimal control; motorsport credibility. |
| 38 | Parametric design-space explorer with FEA | Direct extension of your CadQuery chassis generator. |
| 19 | Non-intrusive load monitoring | Core EEE signal processing with a public benchmark to beat. |
| 60 | Time-series store with custom compression | Systems depth; store the telemetry from #28 in it. |
| 69 | Quantization-aware edge deployment | ESP32 skills + the fastest-growing ML hiring area. |

Notice these five interlock: the kart generates telemetry, the telemetry needs a
store, the store feeds the racing-line solver, and the chassis explorer shares CAD
tooling. **A connected portfolio tells a story; a list of unrelated projects doesn't.**
That story — "I built the full data stack for a real racing team" — is worth more in
an interview than any individual repo.

## How to make any of these actually count

1. **Collect your own data.** The single most cited differentiator. A self-instrumented
   motor beats a Kaggle bearing dataset every time.
2. **State the constraint up front in the README.** "Runs in 180KB RAM at 4mA average"
   is a sentence that makes an engineer keep reading.
3. **Publish the failures.** A section titled "What didn't work and why" is more
   convincing than any accuracy number. Most students hide this; it's free signal.
4. **Benchmark honestly.** Compare against a real baseline. Report p99, not mean.
   Include the case where your approach loses.
5. **Write the README as if for a colleague, not a grader.** Problem → constraint →
   approach → results → limitations. Repos with clear run instructions get
   substantially more recruiter engagement.
6. **Ship one thing end to end before starting the next.** Three finished Tier-2
   projects beat eight abandoned Tier-3 ones.

## A note on scope

Pick projects where the *hard part* line genuinely interests you. You will hit a wall
on every one of these somewhere around week three — the only thing that gets you past
it is caring about the problem. Optimize for that over resume keywords.

---

### Research sources

- [Biggest Problems in India 2026 — Issues Startups Are Solving](https://www.growthjockey.com/blogs/problems-in-india-startups-must-solve)
- [Top 10 Emerging Problems in India That Startups Can Solve](https://www.registerkaro.in/post/top-problems-in-india-that-startups-can-solve)
- [Indian AI Startups Transforming Real-World Challenges](https://www.startup360.news/news/indian-ai-startups-transforming-real-world-challenges-scalable-solutions/)
- [NITI Aayog Frontier Tech Hub](https://frontiertech.niti.gov.in)
- [5 Hard Engineering and Manufacturing Problems to Solve in 2026](https://www.openbom.com/blog/engineering-manufacturing-challenges-2026)
- [Software Engineering for Robotics: Future Research Directions (arXiv)](https://arxiv.org/pdf/2401.12317)
- [TinyML: Tools, Applications, Challenges, and Future Research Directions (arXiv)](https://arxiv.org/pdf/2303.13569)
- [TinyML for On-Device and Edge Analytics in Wireless Networks (arXiv)](https://arxiv.org/pdf/2606.30843)
- [From TinyML to Tiny Language Models: the State of Edge AI in 2026](https://derekmolloy.ie/from-tinyml-to-tiny-language-models-the-state-of-edge-ai-in-2026/)
- [Which Portfolio Projects for ML are actually getting people hired in 2026](https://www.icertglobal.com/community/best-machine-learning-portfolio-projects-to-get-hired-2026)
- [Real AI & ML Project Ideas That Actually Impress Recruiters in 2026](https://blog.uptor.in/real-ai-ml-project-ideas-2026/)
