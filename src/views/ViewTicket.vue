<template lang="pug">
div(v-if="ticket")
  div(v-if="hasLoaded")
    h2
      span.mr-2 {{ticket.title}}
      span.badge(:class="badgeBackground" @click="toggleStatus") {{ticket.status}}
    hr
    h5 Description
    p.ticket-description.overflow-hidden {{ticket.description}}
    hr
    .comment.mb-3.row(:key="uuid()" v-for="(comment, index) in ticket.comments")
      .col-10
        .card
          .card-body.row
            .col-lg-2.col-12
              .avatar
            .col-lg-10.col-12
              h5.card-subtitle.mb-2 user comment &#35;{{index + 1}}
              .comment-text {{comment.text}}
    div(v-if="ticket.status === 'active'")
      hr(v-if="ticket.comments.length")
      form(@submit.prevent="postComment" v-if="ticket.status === 'active'")
        textarea.form-control.mb-3(:id="`post-comment-${ticket.id}`" name="post-comment" required aria-label="ticket comment text" placeholder="Your comment" ref="commentText")
        .d-flex.flex-row
          button.btn.btn-success.mr-auto(:class="{disabled: !fetchEnded}" type="submit") Post comment
          button.btn.btn-warning(@click="takeMeBack" type="button") Take Me back
    div(v-else)
      button.btn.btn-warning(@click="takeMeBack" type="button") Take Me back
    h4(v-if="ticket.fileUrls.length") Attached files
    ul.list-unstyled.m-0(v-if="ticket.fileUrls.length")
      li(v-for="file in ticket.fileUrls")
        a.file-link(:href="`${file.url}`" @click.prevent="saveFile") {{file.name}}
div(v-else)
  TicketNotFound
</template>

<script>

import TicketNotFound from '../components/TicketNotFound'
import uuid from '../mixins/uuid'

import { base64StringToBlob } from 'blob-util'
import { saveAs } from 'file-saver';

export default {
  name: 'ViewTicket',
  components: {
    TicketNotFound
  },
  mixins: [uuid],
  beforeRouteLeave(to, from, next) {
    this.$store.commit('setPreviousRoute', from);

    next();
  },
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  computed: {
    backRoute() {
      return this.$store.state.previousRoute || { name: 'Tickets', params: { page: 0 } };
    },
    fetchEnded() {
      return this.$store.state.fetchEnded;
    },
    badgeBackground() {
      return {
        'bg-danger': this.ticket.status === 'active',
        'bg-success': this.ticket.status === 'resolved',
      }
    },
    hasLoaded() {
      return this.$store.state.tickets
    },
    ticket() {
      const ticket = this.$store.getters.ticket(this.id);

      if (ticket) {
        if (ticket.ticket) {
          const fileUrls = ticket.ticket.files.map(file => ({
            name: file.name,
            url: `/api/files/${file.id}`
          }));

          return {
            ...ticket.ticket,
            fileUrls
          }
        }
      } else {
        return {}
      }

      return null;
    }
  },
  created() {
    if (!this.$store.state.tickets) {
      this.$store.dispatch('fetchTickets');
    }
  },

  methods: {
    takeMeBack() {
      this.$router.push(this.backRoute);
    },
    async saveFile(e) {
      const file = await this.$store.dispatch('fetchFileByUrl', e.target.href);
      const fileBlob = base64StringToBlob(file.data);

      saveAs(fileBlob, file.name);
    },
    async deleteTicket() {
      if (confirm('Are you sure you want to delete ticket?')) {
        await this.$store.dispatch('deleteTicket', this.ticket.id);

        this.$router.push(this.backRoute);
      }
    },
    toggleStatus() {
      const newStatus = this.ticket.status === 'active' ? 'resolved' : 'active';

      this.$store.dispatch('setTicketStatus', { ticketId: this.ticket.id, newStatus });
    },
    postComment() {
      this.$store.dispatch('addComment', {
        ticketId: this.ticket.id,
        comment: {
          text: this.$refs.commentText.value,
          time: Date()
        }
      })

      this.$refs.commentText.value = '';
    }
  }
}
</script>

<style lang="scss" scoped>

.badge {
  cursor: pointer
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 100%;
  background: #dedede
}

.file-link {
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.comment {
  border-radius: 4px;
}

.comment-text {
  background: white;
  border-radius: 4px;
  color: #3b3b3b;
}

.ticket-description {
  overflow-wrap: anywhere;
}
</style>

