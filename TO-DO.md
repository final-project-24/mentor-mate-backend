| route        | model     | model props                                                                                           | middleware                          |
| ------------ | --------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------- |
| /sign-up     | userModel | username, role (mentor/mentee), email, password, confirmPassword, timestamps (created_at, updated_at) | n/a                                 |
| /sign-in     | userModel | n/a                                                                                                   | authentication middleware           |
| /sign-out    | userModel | n/a                                                                                                   | investigate if middleware is needed |
| /delete-user | userModel | n/a                                                                                                   | investigate if middleware is needed |

# To Do

## General

-

## Marina

- give miles some nice pasta recipes

## Jacuub

- rent a dinosaur and buy him a hat

## Milos

- tech some tennis

## Nacho

- play some music

## Miles

- buy pasta

- add image upload (as string)
- add a refresh token (Jakub)
- make token invisible (Jakub)
- https change with variable (Secure Flag)
- Implement pagination (Jakub)

- aws for images (format images before uploading)

- add a spinner to the login page

## Done

- add role to userLogin (userController.ts)

## Ideas

- add a shop for items related to learning a skill, sell the stuff u don't need anymore
  and buy stuff other people don't need anymore

- implement a chat

- add ai chat for users to help them with their learning

- add a calendar for users to schedule their learning

- add a map for users to find other users nearby

- add a rating system for users