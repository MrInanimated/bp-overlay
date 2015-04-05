Dynamic
-------

These bits of text are drawn on the canvas and so will dynamically update.

| Key                             | English text                                                       |
| ------------------------------- | ------------------------------------------------------------------ |
| `dictionaryUpdated`             | The dictionary has been set to %{dictionary} for the next round.   |
| `dictionaries.en`               | English                                                            |
| `dictionaries.fr`               | French                                                             |
| `dictionaries.pokemon_en`       | Pokémon (English)                                                  |
| `minimumBombDuration.updated`   | The minimum bomb duration will be %{duration}s for the next round. |
| `wonLastRound`                  | %{winnerName} won the last round!                                  |
| `languageWords.en`              | an English word                                                    |
| `languageWords.fr`              | a French word                                                      |
| `languageWords.pokemon_en`      | a Pokemon *(Aha, Élisée forgot the accent here.)*                  |
| `pleaseReloadThePage`           | plz reload the page                                                |
| `states.connecting`             | Connecting...                                                      |
| `states.waitingForPlayers`      | Waiting for %{playersNeeded} more players...                       |
| `states.starting`               | The game will start in %{time} seconds...                          |
| `states.playing`                | %{playerName}, type %{languageWord} containing:                    |
| `states.playingMyTurn`          | Quick! Type %{languageWord} containing:                            |
| `states.disconnected`           | Woops. Looks like you got disconnected...                          |


Static
------

These bits of text are (usually) used in the chat, and as such are static and once they are set they cannot change. However, new text from these after a theme has loaded will then use the theme-defined messages.

| Key                                              | English Text                                                                                        |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `nuclearnode:chat.noGuestsAllowed`               | This room doesn't allow guests. Please log in to join.                                              |
| `nuclearnode:chat.banned`                        | You have been banned from this room. Please be respectful and find another room to play in.         |
| `nuclearnode:chat.disconnected`                  | Woops, you got disconnected. Please reload the page.                                                |
| `nuclearnode:chat.joinPartDisabled`              | Wow, there's a lot of people in here! Join/part messages have been disabled until the crowd clears. |
| `nuclearnode:chat.userJoined`                    | %{user} has joined.                                                                                 |
| `nuclearnode:chat.userLeft`                      | %{user} has left.                                                                                   |
| `nuclearnode:chat.userRoleSet`                   | %{user} is now %{role}.                                                                             |
| `nuclearnode:userRoles.`                         | key 'nuclearnode:userRoles. (en)' returned an object instead of string. *(This error message shows up when somebody loses their role. Apparently Élisée didn't forsee the fact that people could be unmodded despite implementing it in the game. Anyway, you can assume this should say "no longer a mod" or somthing similar.)* |
| `nuclearnode:userRoles.moderator`                | Moderator                                                                                           |
| `nuclearnode:userRoles.host`                     | Host                                                                                                |
| `nuclearnode:userRoles.hubAdministrator`         | Super administrator                                                                                 |
| `nuclearnode:chat.userBanned`                    | %{user} has been banned.                                                                            |
| `nuclearnode:chat.removed`                       | (removed) *(This is what banned users' message show up as after they are banned.)*                  |
| `nuclearnode:chat.userUnbanned`                  | %{user} has been unbanned.                                                                          |
| `nuclearnode:settings.room.bannedUsers.none`     | (Nobody) *(This is what is shown in the banned users section if nobody is banned.)*                 |
| `nuclearnode:settingsUpdate.room.welcomeMessage` | The welcome message has been updated: "%{welcomeMessage}".                                          |
| `nuclearnode:settingsUpdate.room.guestAccess`    | Guest access rules have been updated: %{guestAccess}.                                               |
| `nuclearnode:settings.room.guestAccess.deny`     | Can't join                                                                                          |
| `nuclearnode:settings.room.guestAccess.noChat`   | Can only play                                                                                       |
| `nuclearnode:settings.room.guestAccess.full`     | Can play & chat                                                                                     |
| `nuclearnode:chat.logInToChat`                   | This room doesn't allow guests to chat. Please log in first.\*                                      |
| `nuclearnode:chat.typeHereToChat`                | Type here to chat\*                                                                                 |

\* These messages never get changed, so setting them to something else does not do anything.
