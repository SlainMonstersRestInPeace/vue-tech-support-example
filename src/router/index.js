import { createRouter, createWebHistory } from 'vue-router'
import Tickets from '../views/Tickets'
import Report from '../views/Report'
import ViewTicket from '../views/ViewTicket'
import NotFound from '../views/NotFound'


import NotFoundLink from '../components/NotFoundLink'
import TicketLink from '../components/TicketLink'

const routes = [
  {
    path: '/',
    redirect: '/tickets',
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: Tickets,
    props(route) {
      return {
        page: (+route.query.page) - 1
      }
    }
  },
  {
    path: '/report',
    name: 'Report',
    component: Report
  },
  {
    path: '/ticket/:id',
    name: 'ViewTicket',
    components: {
      default: ViewTicket,
      'ticket-link': TicketLink
    },
    props: {
      default (route) {
        return {
          id: +route.params.id
        }
      },
      "ticket-link" (route) {
        return {
          id: +route.params.id
        }
      }
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    props: true,
    components: {
      default: NotFound,
      'not-found': NotFoundLink
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
