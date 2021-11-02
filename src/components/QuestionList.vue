<template>
  <div>
    <flow-form
      ref="flowform"
      @submit="onSubmit"
      :questions="questions"
      :language="language"
      :standalone="true"
    >
      <template v-if="!submitted" v-slot:complete>
        <ul style="margin-bottom: 3rem">
          <li v-for="question in questions" :key="question.id">
            <p>{{ question.index + 1 }} . {{ question.title }}</p>
            <audio v-if="question.type === 'FlowFormFileType'" controls>
              <source :src="question.answer" />
            </audio>
            <p v-else style="color: black; font-style: italic">
              {{ question.answer || "not answer" }}
            </p>
            <hr />
          </li>
        </ul>
      </template>
    </flow-form>
  </div>
</template>

<script>
import FlowForm from "./FlowForm.vue";
import LanguageModel from "../models/LanguageModel";
import QuestionModel, {
  QuestionType,
  ChoiceOption,
} from "../models/QuestionModel";

export default {
  components: {
    FlowForm,
  },
  data() {
    return {
      submitted: false,
      language: new LanguageModel({
        enterKey: this.$t("enterKey"),
        shiftKey: this.$t("shiftKey"),
        ok: this.$t("ok"),
        continue: this.$t("continue"),
        skip: this.$t("skip"),
        pressEnter: this.$t("pressEnter"),
        multipleChoiceHelpText: this.$t("multipleChoiceHelpText"),
        multipleChoiceHelpTextSingle: this.$t("multipleChoiceHelpTextSingle"),
        otherPrompt: this.$t("otherPrompt"),
        placeholder: this.$t("placeholder"),
        submitText: this.$t("submitText"),
        longTextHelpText: this.$t("longTextHelpText"),
        prev: this.$t("prev"),
        next: this.$t("next"),
        percentCompleted: this.$t("percentCompleted"),
        invalidPrompt: this.$t("invalidPrompt"),
        thankYouText: this.$t("thankYouText"),
        successText: this.$t("successText"),
        ariaOk: this.$t("ariaOk"),
        ariaRequired: this.$t("ariaRequired"),
        ariaPrev: this.$t("ariaPrev"),
        ariaNext: this.$t("ariaNext"),
        ariaSubmitText: this.$t("ariaSubmitText"),
        ariaMultipleChoice: this.$t("ariaMultipleChoice"),
        ariaTypeAnswer: this.$t("ariaTypeAnswer"),
      }),
      questions: [
        new QuestionModel({
          id: "first_name",
          tagline: "Hi! Welcome to our demo survey 😊",
          title: "What is your first name?",
          type: QuestionType.Text,
          placeholder: "Start typing here...",
        }),
        new QuestionModel({
          id: "email",
          tagline: "Nice to meet you 👀, let's continue",
          title: "Provide an example email.",
          type: QuestionType.Email,
          placeholder: "Start typing here...",
        }),
        new QuestionModel({
          id: "phone",
          title: "Doing great! 👍 Go ahead and try with a phone number.",
          type: QuestionType.Phone,
          mask: "####-###-###",
        }),
        // This is question for record
        new QuestionModel({
          id: "file",
          title: "Tell me about you.",
          type: QuestionType.File,
          allowOther: true,
          required: true,
        }),

        new QuestionModel({
          id: "place_choices",
          title: "Where are you from?",
          type: QuestionType.MultipleChoice,
          multiple: false,
          helpText: "Select your place. 👇",
          options: [
            new ChoiceOption({
              label: "Paris",
            }),
            new ChoiceOption({
              label: "Lodon",
            }),
            new ChoiceOption({
              label: "Helsinki",
            }),
            new ChoiceOption({
              label: "Berlin",
            }),
          ],
        }),
      ],
    };
  },

  methods: {
    onSubmit() {
      this.submitted = true;
    },

    onSendData() {
      console.log("okeke onSendData");
      // Set `submitted` to true so the form knows not to allow back/forward
      // navigation anymore.
      // this.$refs.flowform.submit();
      this.$refs.flowform.submitted = true;

      this.submitted = true;

      /* eslint-disable-next-line no-unused-vars */
      const data = this.getData();
      /*
          You can use Fetch API to send the data to your server, eg.:

          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
        */
    },
  },
};
</script>

<style scoped>
@import "~@ditdot-dev/vue-flow-form/dist/vue-flow-form.css";
@import "~@ditdot-dev/vue-flow-form/dist/vue-flow-form.theme-green.css";
</style>