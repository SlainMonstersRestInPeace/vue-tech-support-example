import { createStore } from 'vuex'

import axios from 'axios';

async function fetchOperation({ commit, state, dispatch }, url, { options, onSuccess, transformResponse, errorHandler }) {
  options = options || {};
  onSuccess = onSuccess || (() => {});
  transformResponse = transformResponse || (res => res);
  errorHandler = errorHandler || (err => {throw err});

  let res = {};

  try {
    if (state.fetchEnded) {
      commit('fetchStart');

      res = await axios(url, options);
      res = transformResponse(res);

      await onSuccess(res, { commit, state, dispatch });
    }
  } catch (err) {
    commit('fetchEnd');

    errorHandler(err);
  }

  commit('fetchEnd');

  return res;
}

export default createStore({
  state: {
    tickets: null,
    fetchEnded: true,
    error: null,
    filters: {
      title: '',
      description: '',
      active: true,
      resolved: true
    },
    previousRoute: null,
  },
  getters: {
    ticket(state) {
      return id => {
        if (state.tickets) {
          const ticket = state.tickets.find(ticket => ticket.id === id);

          return { ticket }
        } else {
          return null
        }
      }
    },
    filteredTickets(state) {
      const tickets = state.tickets || [];

      const { title, description, active, resolved } = { ...state.filters };

      function queryIntersection(arr1, arr2) {
        return arr1.filter(item => arr2.includes(item));
      }

      const haveIntersection = (datum, query) => {
        const datumTokens = datum.toLowerCase().split(' ');
        const queryTokens = query.toLowerCase().split(' ');

        return queryIntersection(datumTokens, queryTokens).length > 0;
      }

      let intersection = tickets;

      intersection = title ? intersection.filter(ticket => haveIntersection(ticket.title, title)) : intersection;
      intersection = description ? intersection.filter(ticket => haveIntersection(ticket.description, description)) : intersection;

      let union = [];

      union = active ? union.concat(intersection.filter(item => item.status === 'active')) : union;
      union = resolved ? union.concat(intersection.filter(item => item.status === 'resolved')) : union;

      return union;
    }
  },
  mutations: {
    setPreviousRoute(state, route) {
      state.previousRoute = { ...route }
    },
    setFilters(state, filters) {
      state.filters = { ...filters };
    },
    fetchStart(state) {
      state.fetchEnded = false;
    },
    fetchEnd(state) {
      state.fetchEnded = true;
    },
    setTickets(state, tickets) {
      state.tickets = tickets;
    },
    setTicket(state, { id, ticketData }) {
      if (state.tickets) {
        state.tickets = state.tickets.map(ticket => ticket.id === id ? { ...ticket, ...ticketData } : ticket);
      }
    },
    addTicket(state, ticket) {
      if (state.tickets) {
        state.tickets = [...state.tickets, ticket];
      }
    },
    removeTicket(state, id) {
      if (state.tickets) {
        state.tickets = state.tickets.filter(ticket => ticket.id !== id);
      }
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchTickets(cxt) {
      return fetchOperation(cxt, "/api/tickets", {
        transformResponse: res => res.data,
        onSuccess:  (data, { commit }) => {
          commit('setTickets', data)
        }
      })
    },
    async fetchTicket(cxt, id) {
      return fetchOperation(cxt, `/api/tickets/${id}`, {
        transformResponse: res => res.data
      });
    },
    async createTicket(cxt, ticket) {
      return fetchOperation(cxt, '/api/tickets', {
        options: {
          method: 'POST',
          data: JSON.stringify(ticket),
          headers: {
            "Content-type": 'application/json'
          }
        },
        transformResponse: res => res.data,
        onSuccess: (data, { commit }) => {
          commit('addTicket', data)
        }
      })
    },
    async updateTicket(cxt, { id, ticketData }) {
      return fetchOperation(cxt, `/api/tickets/${id}`, {
        options: {
          method: 'PUT',
          data: JSON.stringify(ticketData),
          headers: {
            'Content-type': 'application/json'
          }
        },
        transformResponse: res => res.data,
        onSuccess: (data, { commit }) => {
          commit('setTicket', { id, ticketData: data })
        }
      })
    },
    async deleteTicket(cxt, id) {
      return fetchOperation(cxt, `/api/tickets/${id}`, {
        options: {
          method: 'DELETE',
        },
        transformResponse: res => res,
        onSuccess: (data, { commit }) => {
          commit('removeTicket', id);
        }
      })
    },
    async addComment({ dispatch }, { ticketId, comment }) {
      const ticketToUpdate = await dispatch('fetchTicket', ticketId);
      const newTicket = { ...ticketToUpdate, comments: [...ticketToUpdate.comments, comment] };

      return await dispatch('updateTicket', { id: ticketId, ticketData: newTicket })
    },
    async setTicketStatus({ dispatch }, { ticketId, newStatus }) {
      const ticketToUpdate = await dispatch('fetchTicket', ticketId);
      const newTicket = { ...ticketToUpdate, status: newStatus };

      return await dispatch('updateTicket', { id: ticketId, ticketData: newTicket })
    },
    async fetchFile(cxt, id) {
      return fetchOperation(cxt, `/api/files/${id}`, {
        transformResponse: res => res.data
      });
    },
    async fetchFileByUrl(cxt, url) {
      return fetchOperation(cxt, url, {
        transformResponse: res => res.data
      });
    },
    async uploadFile(cxt, file) {
      return fetchOperation(cxt, '/api/files', {
        transformResponse: res => res.data,
        options: {
          method: 'POST',
          data: JSON.stringify(file),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })
    }
  },
  modules: {
  }
})