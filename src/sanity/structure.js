import {CogIcon} from '@sanity/icons'
import { HomeIcon } from '@sanity/icons'
import {UserIcon} from '@sanity/icons'


// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure = (S) =>
      S.list()
        .title('Content')
        .items([
          S.listItem()
            .title('Settings')
            .icon(CogIcon)
            .child(
              S.editor()
                .id('settings')
                .schemaType('settings')
                .documentId('settings')
                .title('Settings')
            ),
          S.divider(),
          S.listItem()
            .title('Home Page')
            .icon(HomeIcon)
            .child(
              S.editor()
                .id('homePage')
                .schemaType('homePage')
                .documentId('homePage')
                .title('Home Page')
          ),
          S.listItem()
            .title('About Page')
            .icon(UserIcon)
            .child(
              S.editor()
                .id('aboutPage')
                .schemaType('aboutPage')
                .documentId('aboutPage')
                .title('About Page')
          ),
          // S.documentTypeListItem("post").title("Posts"),
          // S.documentTypeListItem("person").title("People"),
          S.documentTypeListItem("service").title("Services"),
          S.documentTypeListItem("project").title("Projects"),
        ])