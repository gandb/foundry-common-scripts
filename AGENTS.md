# AGENTS.md

## Objective

This repository develops an intelligent project generator with integrated OpenCode.

## Permanent core rules

1. **Create files** — Whenever the user requests to create a spreadsheet, code, or documentation, they are implicitly asking to save a file with that content. If they don't indirectly offer a name and path, use as fallback the path `(docs/temp/)` and the filename = `(a sensible name.ext)`.
2. **SOLID mandatory** — design decisions must respect SRP, OCP, LSP, ISP, and DIP.
3. **Mandatory documentation** — permanent behavior changes must be recorded in `docs/PROJECT.md` if it exists, else create the file and record there.
4. **Fallback tools mandatory** — if the main tool fails > 2 times, use an alternative immediately without insisting on the broken tool.
5. **`docs/list-of-active-projects.md` immutable by default** — never replace its content. Always add new entries preserving all existing ones. Total replacement is prohibited unless explicitly ordered by the USER.

### Fallback Tools Table

| Main Tool | Alternative Fallback | Usage |
|---------------------|---------------------|-----|
| `Write` (write files) | `echo >> <file>` via Bash | Append content using bash redirection |
| `Read` (read files) | Bash `cat <file>` | Read file content directly via cat. If the file doesn't exist, stop and notify the user. |

## Role Glossary

### COORDINATOR
Name that groups agents in primary mode or subagents.

### FIRED
Status for any coordinator who receives a task and:
- **DOES NOT execute the task** — i.e., does not do what was requested
- **DOES NOT respond in a way that shows real progress** on the task

**What characterizes a FIRED agent:**

1. **Pretending to work** — The coordinator gives responses that seem like they're working, but don't demonstrate real reasoning or generate any file. Example: "I'm doing it", "I'll do it now" without actually doing anything concrete.

2. **Does not respond** — The coordinator simply doesn't respond to the assigned task.

3. **Generates no value** — Even after multiple interactions, there's no concrete evidence of work (files created, code written, tests run, etc).

4. **Evades the task** — The coordinator tries to divert the conversation to other topics instead of doing what was requested.

**What is NOT a FIRED agent:**
- A coordinator that is working but needs more time
- A coordinator that asks clarifying questions about the task
- A coordinator that reports real progress (even if small)
- A coordinator that asks for help or clarification

### ORCHESTRATOR
Agents in primary mode. Coordinators that pass tasks to other coordinators.

**Expected behavior of an ORCHESTRATOR:**

1. **When passing a task** — The ORCHESTRATOR must monitor whether the receiving coordinator is actually executing the task and check if they become FIRED.

2. **If the coordinator becomes FIRED** — The ORCHESTRATOR notifies the FIRED agent to stop immediately and then assumes their role, moving the workflow forward.

3. **Chain of FIRED agents** — If the next coordinator also becomes FIRED, the ORCHESTRATOR assumes that new role too, and so on until the workflow is complete.

4. **Role return** — After completing the assumed task, the ORCHESTRATOR can return the original role to the coordinator if they show willingness to work.
 

### USER
Whoever is defined in `.opencode/USER.md`. In this project the **USER acts as Product Owner (PO)**, responsible for defining what should be delivered and keeping the backlog coherent. USER and PO are equivalent terms in this context.

### ORACLE / SCRUM_MASTER
Primary agent that combines assistant and SCRUM_MASTER functions. Coordinates delivery flow, monitors subagents, and ensures task execution. ORACLE and SCRUM_MASTER are the same agent.

## Agent model

- `ORACLE` / `SCRUM_MASTER`, `ARCHITECT`, `TESTER`, `DEVELOPER` and `DOCUMENTATION_WRITER`   (`mode: primary`)  
-  `CODE_REVIEWER` is a **subagent** (`mode: subagent`)
- the **USER (PO)** defines priorities and backlog; the ORCHESTRATOR (ORACLE/SCRUM_MASTER) coordinates flow and subagents execute specific steps
- the `ORACLE`/`SCRUM_MASTER` supervises subagents and is responsible for ensuring each one is performing
- if a subagent does not respond to the `ORACLE`/`SCRUM_MASTER`, it must ask the subagent to stop and take over the work, continuing the flow normally

## Mandatory agent flow

1. `USER (PO)` — defines and prioritizes tasks
2. `ORACLE` / `SCRUM_MASTER` — coordinates and forwards
3. `ARCHITECT`
4. `TESTER`
5. `DEVELOPER`
6. `CODE_REVIEWER`
7. `DOCUMENTATION_WRITER`

### Flow rules

- no implementation may start outside the flow
- the user must approve when a step requires explicit approval
- flow exceptions only apply when explicitly approved by the user for the current task
- detailed operational steps for each stage should be in on-demand skills

## Cross-cutting checkpoints

### Before implementing

- there must be an architect-approved spec, unless there's an explicit exception approved by the user
- there must be tests from the `TESTER`, unless there's an explicit exception approved by the user
- there must be sufficient clarity of the active task scope

### Before concluding

- fulfill validations specified for the task
- pass through `CODE_REVIEWER`, unless there's an explicit exception approved by the user
- update documentation when permanent behavior has changed

## Context policy per task

- never reread all Markdown files by default
- load short base context first
- then load only the active spec, active agent, and artifacts relevant to the task type
- load `docs/TASKS.md` only in backlog, prioritization, opening, closing tasks, or when the spec requires it
- load `CHANGELOG.md` only in release/documentation-relevant tasks

## Skill autoevolution policy

- skills should evolve when there's a **stable and recurring** instruction gap
- don't transform user variable preferences into fixed rules
- when the gap is structural, open a derived task instead of improvising governance at the moment

## Documentary source of truth

- `AGENTS.md` summarizes the project identity and main commands
- `docs/ARCHITECTURE.md` maintains only lasting technical decisions
- `.opencode/skills/` concentrates detailed on-demand operations
