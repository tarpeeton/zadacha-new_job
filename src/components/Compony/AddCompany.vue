<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
const campaignName = ref('')
const selectedOption = ref<{ label: string; value: string } | null>(null)
const selectedAudience = ref('all')
const ageFrom = ref<number | null>(null)
const ageTo = ref<number | null>(null)
const budget = ref<number | null>(null)
const startDate = ref('')
const startTime = ref('')
const endDate = ref('')
const endTime = ref('')
const geolocation = ref('')
const adText = ref('')
const uploadedFile = ref<File | null>(null)
const filePreviewUrl = ref<string | null>(null)
const showPreview = ref(false)

const availableBudget = ref(0)

const isOpen = ref(false)
const selectRef = ref<HTMLElement | null>(null)

const options = ref([
  { label: 'Трафик', value: 'traffic' },
  { label: 'Конверсии', value: 'conversion' },
  { label: 'Лиды', value: 'leads' },
])

const audienceOptions = ref([
  { label: 'Все', value: 'all' },
  { label: 'Мужчина', value: 'male' },
  { label: 'Женщина', value: 'female' },
  { label: 'Другое', value: 'other' },
])

const isFormValid = computed(() => {
  return campaignName.value.trim() !== '' &&
         selectedOption.value !== null &&
         budget.value !== null &&
         budget.value > 0 &&
         startDate.value !== '' &&
         endDate.value !== '' &&
         adText.value.trim() !== ''
})

const budgetText = computed(() => {
  return `Доступно: ${availableBudget.value.toLocaleString()} сум`
})

const toggleSelect = () => {
  isOpen.value = !isOpen.value
}

const select = (option: { label: string; value: string }) => {
  selectedOption.value = option
  isOpen.value = false
}

const selectAudience = (value: string) => {
  selectedAudience.value = value
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    uploadedFile.value = file

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        filePreviewUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    } else {
      filePreviewUrl.value = null
    }
  }
}

const togglePreview = () => {
  showPreview.value = !showPreview.value
}

const removeFile = () => {
  uploadedFile.value = null
  filePreviewUrl.value = null
  showPreview.value = false
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

const saveDraft = () => {
  const formData = {
    campaignName: campaignName.value,
    campaignType: selectedOption.value,
    targetAudience: selectedAudience.value,
    ageRange: { from: ageFrom.value, to: ageTo.value },
    budget: budget.value,
    schedule: {
      start: { date: startDate.value, time: startTime.value },
      end: { date: endDate.value, time: endTime.value }
    },
    geolocation: geolocation.value,
    adText: adText.value,
    mediaFile: uploadedFile.value
  }

  console.log('Saving draft:', formData)
  alert('Черновик сохранен!')
}

const publishCampaign = () => {
  if (!isFormValid.value) {
    alert('Пожалуйста, заполните все обязательные поля')
    return
  }

  const formData = {
    campaignName: campaignName.value,
    campaignType: selectedOption.value,
    targetAudience: selectedAudience.value,
    ageRange: { from: ageFrom.value, to: ageTo.value },
    budget: budget.value,
    schedule: {
      start: { date: startDate.value, time: startTime.value },
      end: { date: endDate.value, time: endTime.value }
    },
    geolocation: geolocation.value,
    adText: adText.value,
    mediaFile: uploadedFile.value
  }

  console.log('Publishing campaign:', formData)
  alert('Кампания опубликована!')
}

const deleteCampaign = () => {
  if (confirm('Вы уверены, что хотите удалить эту кампанию?')) {
    campaignName.value = ''
    selectedOption.value = null
    selectedAudience.value = 'all'
    ageFrom.value = null
    ageTo.value = null
    budget.value = null
    startDate.value = ''
    startTime.value = ''
    endDate.value = ''
    endTime.value = ''
    geolocation.value = ''
    adText.value = ''
    removeFile()

    alert('Кампания удалена!')
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  setTimeout(() => {
    availableBudget.value = 1500000
  }, 1000)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
  if (filePreviewUrl.value) {
    URL.revokeObjectURL(filePreviewUrl.value)
  }
})
</script>

<template>
  <div class="top_bar">
    <div class="breadcrumb">
      <div class="breadcrumb__items">
        <span class="breadcrumb__item">Мои кампании</span>
        <span class="breadcrumb__separator">/</span>
        <span class="breadcrumb__item breadcrumb__item--current">Создание рекламной кампании</span>
      </div>
    </div>
    <div class="add__company__actions">
      <h1 class="add__company">Добавить рекламную кампанию</h1>
      <div class="actions">
        <button class="btn btn-danger" @click="deleteCampaign">Удалить</button>
        <button class="btn btn-secondary" @click="saveDraft">Сохранить черновик</button>
        <button
          class="btn btn-primary"
          @click="publishCampaign"
          :disabled="!isFormValid"
        >
          Опубликовать
        </button>
      </div>
    </div>
  </div>

  <!-- inputs -->
  <div class="add__contents">
    <div class="info_content">
      <div class="info_content_items">
        <p class="input__label">Название кампании</p>
        <input
          v-model="campaignName"
          class="info__input"
          placeholder="Введите название"
        />
      </div>

      <!-- select type company -->
      <div class="info_content_items">
        <p class="input__label">Тип кампании</p>
        <div class="select_wrapper" ref="selectRef">
          <div class="select_input" @click="toggleSelect">
            <span class="select__type">{{ selectedOption?.label || 'Выберите тип' }}</span>
            <span class="arrow-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m11.565 13.873l-2.677-2.677q-.055-.055-.093-.129q-.037-.073-.037-.157q0-.168.11-.289q.112-.121.294-.121h5.677q.181 0 .292.124t.111.288q0 .042-.13.284l-2.677 2.677q-.093.093-.2.143t-.235.05t-.235-.05t-.2-.143"
                />
              </svg>
            </span>
          </div>
          <div v-if="isOpen" class="select_dropdown">
            <div
              v-for="option in options"
              :key="option.value"
              class="select_option"
              @click="select(option)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- radio button for target audience -->
      <div class="info_content_items">
        <p class="input__label">Целевая аудитория</p>
        <div class="radio_group">
          <div
            v-for="audience in audienceOptions"
            :key="audience.value"
            class="radio_item"
            @click="selectAudience(audience.value)"
          >
            <div class="radio_button">
              <div
                :class="[
                  'radio_circle',
                  { 'radio_circle--active': selectedAudience === audience.value },
                ]"
              >
                <div v-if="selectedAudience === audience.value" class="radio_dot"></div>
              </div>
            </div>
            <span class="radio_label">{{ audience.label }}</span>
          </div>
        </div>
      </div>

      <!-- age select -->
      <div class="info_content_items age_min">
        <p class="input__label">Возрастная группа</p>
        <div class="min_max_age">
          <input
            v-model.number="ageFrom"
            class="info__input"
            placeholder="От"
            type="number"
            min="18"
            max="100"
          />
          <input
            v-model.number="ageTo"
            class="info__input"
            placeholder="До"
            type="number"
            min="18"
            max="100"
          />
        </div>
      </div>

      <!-- budget -->
      <div class="info_content_items">
        <div class="budget_info">
          <p class="input__label">Бюджет</p>
          <span>{{ budgetText }}</span>
        </div>
        <input
          v-model.number="budget"
          class="info__input"
          placeholder="Введите бюджет"
          type="number"
          min="0"
          :max="availableBudget"
        />
      </div>

      <!-- start date/time -->
      <div class="info_content_items age_min">
        <p class="input__label">Начало проведения</p>
        <div class="min_max_age">
          <input
            v-model="startDate"
            class="info__input"
            placeholder="От"
            type="date"
          />
          <input
            v-model="startTime"
            class="info__input"
            placeholder="До"
            type="time"
          />
        </div>
      </div>

      <!-- end date/time -->
      <div class="info_content_items age_min">
        <p class="input__label">Конец проведения </p>
        <div class="min_max_age">
          <input
            v-model="endDate"
            class="info__input"
            placeholder="От"
            type="date"
            :min="startDate"
          />
          <input
            v-model="endTime"
            class="info__input"
            placeholder="До"
            type="time"
          />
        </div>
      </div>

      <!-- location -->
      <div class="info_content_items">
        <p class="input__label">Геолокация</p>
        <div class="select__geo">
          <input
            v-model="geolocation"
            class="info__input geo_input"
            placeholder="Введите геолокацию"
          />
          <span class="arrow-icon geo_input__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 19.677q2.82-2.454 4.458-4.991t1.638-4.39q0-2.744-1.737-4.53Q14.62 3.981 12 3.981T7.641 5.766t-1.737 4.53q0 1.852 1.638 4.39T12 19.677m0 .879q-.235 0-.47-.077t-.432-.25q-1.067-.981-2.164-2.185q-1.096-1.203-1.99-2.493t-1.468-2.633t-.572-2.622q0-3.173 2.066-5.234Q9.037 3 12 3t5.03 2.062q2.066 2.061 2.066 5.234q0 1.279-.572 2.613q-.572 1.333-1.458 2.632q-.885 1.3-1.981 2.494T12.92 20.21q-.191.173-.434.26q-.244.086-.487.086m.004-8.825q.667 0 1.14-.476q.472-.475.472-1.143t-.476-1.14t-1.143-.472t-1.14.476t-.472 1.143t.475 1.14t1.144.472"/>
            </svg>
          </span>
        </div>
      </div>
    </div>

    <!-- Right column -->
    <div class="info_content">
      <div class="info_content_items">
        <p class="input__label">Текст объявления </p>
        <textarea
          v-model="adText"
          class="text_obyev"
          placeholder="Введите текст объявления"
          rows="5"
        />
      </div>

      <!-- media -->
      <div class="info_content_items">
        <p class="input__label">Добавить медиа</p>
        <div class="info__input">
          <input
            class=""
            placeholder="Выберите файл"
            type="file"
            accept="image/*,video/*"
            @change="handleFileUpload"
          />
        </div>

        <!-- File info -->
        <div v-if="uploadedFile" style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px;">
          <p style="margin: 0 0 5px 0; font-size: 14px;">
            <strong>Файл:</strong> {{ uploadedFile.name }}
          </p>
          <p style="margin: 0 0 10px 0; font-size: 12px; color: #666;">
            Размер: {{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB
          </p>
          <button
            @click="removeFile"
            style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;"
          >
            Удалить файл
          </button>
        </div>
      </div>

      <!-- Preview button -->
      <div>
        <button class="view_button" @click="togglePreview">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3"/>
          </svg>
          <span class="view_button__text">{{ showPreview ? 'Скрыть предварительный просмотр' : 'Предварительный просмотр' }}</span>
        </button>
      </div>

      <!-- File preview -->
      <div
        v-if="showPreview && filePreviewUrl"
        style="margin-top: 20px; padding: 15px; border: 2px dashed #ddd; border-radius: 8px; text-align: center;"
      >
        <h4 style="margin: 0 0 15px 0;">Предварительный просмотр медиа</h4>
        <img
          :src="filePreviewUrl"
          :alt="uploadedFile?.name"
          style="max-width: 100%; max-height: 300px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
        />
      </div>

      <!-- Campaign preview -->
      <div
        v-if="showPreview && (campaignName || adText)"
        style="margin-top: 20px; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; background: #f8f9fa;"
      >
        <h4 style="margin: 0 0 15px 0; color: #495057;">Предварительный просмотр объявления</h4>
        <div style="background: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <h5 v-if="campaignName" style="margin: 0 0 10px 0; color: #212529;">{{ campaignName }}</h5>
          <p v-if="adText" style="margin: 0; color: #6c757d; line-height: 1.5;">{{ adText }}</p>
          <div v-if="filePreviewUrl" style="margin-top: 10px;">
            <img
              :src="filePreviewUrl"
              style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 4px;"
            />
          </div>
        </div>
      </div>
    </div>
  </div>


</template>




<!-- style -->


<style scoped>
.top_bar {
  padding: 32px;
}

.add__company__actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.add__company {
  font-size: 28px;
  font-weight: 700;
  color: #344054;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #7a869a;
  font-family: sans-serif;
}

.breadcrumb__items {
  display: flex;
  align-items: center;
  gap: 6px;
}

.breadcrumb__separator {
  color: #74849d;
}

.breadcrumb__item--current {
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.btn {
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-danger {
  background: none;
  color: #e5484d;
}

.btn-danger:hover {
  background: #e5484d;
  color: white;
}

.btn-secondary {
  background-color: #f6f7f9;
  color: #2e3a59;
}

.btn-secondary:hover {
  background-color: #e4e7eb;
}

.btn-primary {
  background: linear-gradient(90deg, #16a085, #1abc9c);
  color: white;
}

.btn-primary:hover {
  opacity: 0.9;
}

.add__contents {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 0 32px;
}

.info_content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 20px;
  padding: 32px 25px;
  border-radius: 12px;
  box-shadow: 0 4px 6px 0 #8181811a;
}

.info_content_items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input__label {
  margin: 0;
  font-size: 18px;
  color: #0f172a;
  font-weight: 600;
}

.info__input {
  all: unset;
  padding: 10px 8px;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  font-size: 16px;
  color: #0f172a;
}

.select_wrapper {
  position: relative;
  width: 100%;
}
.select__type {
  padding-left: 8px;
}
.select_input {
  width: 100%;
  height: 40px;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  background-color: white;
  font-size: 16px;
  color: #0f172a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.select_dropdown {
  position: absolute;
  top: 105%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  box-shadow: 0 4px 6px #8181811a;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.select_option {
  padding: 10px 12px;
  font-size: 16px;
  cursor: pointer;
  color: #0f172a;
  transition: background 0.2s;
}

.select_option:hover {
  background-color: #f6f7f9;
}

.arrow-icon {
  font-size: 12px;
  color: #2e3a59;
  pointer-events: none;
}

/* Custom Radio Button Styles */
.radio_group {
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  flex-wrap: wrap;
}

.radio_item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.radio_item:hover .radio_label {
  color: #16a085;
}

.radio_button {
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio_circle {
  width: 18px;
  height: 18px;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: white;
}
.radio_dot {
  width: 6px;
  height: 6px;
  background-color: #16a085;
  border-radius: 50%;
  transition: all 0.2s ease;
}
.radio_circle--active {
  background-color: #16a085;
}
.radio_circle--active .radio_dot {
  background-color: white;
}

.radio_label {
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
  transition: color 0.2s ease;
}

.radio_item:hover .radio_circle {
  border-color: #16a085;
}

.age_min {
  margin-top: 20px;
}

.min_max_age {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.budget_info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.budget_info span {
  color: #6b778a;
  font-size: 14px;
}
.select__geo {
  width: 100%;
  position: relative;
}

.geo_input {
  width: 98%;
}
.geo_input__icon {
  position: absolute;
  top: 5px;
  right: 10px;
}



.text_obyev {
  padding: 10px 8px;
  height: 160px;
  border: 1px solid #f2f2f2;
  border-radius: 6px;
  font-size: 16px;
  color: #0f172a;
}


input[type="file"]::file-selector-button {
  background-color: rgba(9, 30, 66, 0.04);
  color: #344054;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.view_button {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background-color: rgba(23, 39, 67, 0.04);
  display: flex;
  flex-direction: row;
  align-content: center;
  gap: 4px;
}
.view_button svg {
  color: #344054;
}
.view_button__text {
  font-size: 14px;
  color: #344054;
  font-weight: 600;
  display: flex;
  align-items: center;
}

</style>
