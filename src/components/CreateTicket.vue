<template lang="pug">
form.mb-3(action="" @submit.prevent="onSubmit")
  .mb-3.mx-auto
    label.form-label(for="ticket-title") Ticket Title
    input.form-control#ticket-title(v-model="ticket.title" name="ticket-title" type="text" required placeholder="State the problem here...")
  .mb-3.mx-auto
    label.form-label(for="ticket-description") Ticket Description
    textarea.form-control#ticket-description(v-model="ticket.description" name="ticket-description" required placeholder="Detail the problem here..." rows="5")
  .d-flex.flex-row.align-items-center
    label.form-label.mb-0.mr-2.flex-shrink-0(for="ticket-file") Attach Files:
    input.form-control-file.mr-auto#ticket-file(type="file" multiple name="ticket-file" ref="file")
    button.flex-shrink-0.btn.btn-primary.mr-2(:class="{disabled: !fetchEnded}" type="submit") Create Ticket
    button.flex-shrink-0.btn.btn-danger(type="button" @click="takeMeBack") Cancel
.alert-anchor.position-relative
  .alert.alert-success.alert-dismissible.fade.m-0.position-absolute.w-100(role="alert" ref="alertSuccess") 
    | Your issue has been submitted. You can 
    router-link.alert-link(:to="backRoute") go back
    | .
    button.close(type="button" aria-label="Close" @click="hideAlert($refs.alertSuccess)")
      span(aria-hidden="true") &times;
  .alert.alert-danger.alert-dismissible.fade.m-0(role="alert" ref="alertError")
    | There was an error trying to submit this issue.
    button.close(type="button" aria-label="Close" @click="hideAlert($refs.alertError)")
      span(aria-hidden="true") &times;
</template>

<script>

export default {
  name: 'CreateTicket',
  emits: ['create-ticket'],

  data() {
    return {
      ticket: {
        title: '',
        description: '',
      },
    }
  },
  computed: {
    fetchEnded() {
      return this.$store.state.fetchEnded
    },
    backRoute() {
      return this.$store.state.previousRoute || { name: 'Tickets', params: { page: 0 } };
    },
  },
  methods: {
    takeMeBack() {
      this.$router.push(this.backRoute);
    },
    showAlert(alert) {
      if (!alert.classList.contains('show')) {
        alert.classList.add('show');
        alert.style.zIndex = '100';
      }
    },
    hideAlert(alert) {
      alert.classList.remove('show');
      alert.style.zIndex = '0';
    },
    async fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
          const binary = e.target.result;
          const base64 = btoa(binary);

          resolve(base64);
        }

        reader.onerror = error => reject(error);
        reader.readAsBinaryString(file);
      })
    },
    async onSubmit() {
      try {
        const files = this.$refs.file.files;
        const tobase64 = this.fileToBase64;

        const b64Data = await Promise.all([].map.call(files, async file => {
          return {
            name: file.name,
            data: await tobase64(file),
          }
        }));

        const uploadedFiles = [];

        for (let b64 of b64Data) {
          const file = await this.$store.dispatch('uploadFile', b64);

          uploadedFiles.push({ id: file.id, name: file.name });
        }

        this.$emit('create-ticket', { ...this.ticket, comments: [], status: 'active', files: uploadedFiles })

        this.ticket.title = '';
        this.ticket.description = '';
        files.value = '';

        this.showAlert(this.$refs.alertSuccess);
        this.hideAlert(this.$refs.alertError);
      } catch (err) {
        this.showAlert(this.$refs.alertError);
        this.hideAlert(this.$refs.alertSuccess);

        throw err;
      }
    }
  }
}
</script>

<style scoped lang="scss">
textarea {
  resize: none;
}
</style>