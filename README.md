# ROLES:
- Trevor (dad) - Database integration and frontend
- Frank - AI prompting replacement and backend handling
- Watson - Frontend design and static imports

# TO DO:

## Frontend:
- Change theme to 'fundraise' vibes
- Navigation
- Wallet Connection (?)
- Create a charity reference
- Create tags

## Backend:
- Change Flight prompting into Blockchain donation mechanism
- Integrate on chain logic to handle connect wallet and donation gateway
- Update logic: Change prompt context from open web search into the Database specific list
- app/(chat)/api/chat/route.ts: Change prompt system from Flight function into Organization
- ai/actions.ts: Change functions to relate to charity organization

## Database:
- Change PostGres URL into Pocketbase
- "Create Listing" connection from static to dynamic (Create push functions to save onto database)
- Update logic: Create a funnel mechanism to take all database information from Charities type to become prompt context
- Database tables: "User" (R: Message history O: Previous Donations, O: Account Type Donator or Organization) | "Organizations"  (R: Tags [N4P, 4P, DAO, others], R: Charity Context [JSON], O: Owner)

## Definitions
R: = Required
O: = Optional
N4P = Not 4 Profit
4P = 4 Profit
