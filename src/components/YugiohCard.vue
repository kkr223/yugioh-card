<template>
  <div class="yugioh-card-container">
    <div class="yugioh-card">
      <div ref="card" class="card" />
    </div>
    <div class="form">
      <div class="form-header">
        <div class="form-title">
          <span>游戏王卡片 - Yugioh Card</span>
          <Icon
            class="github-icon"
            icon="ri:github-fill"
            width="24"
            height="24"
            @click="toGithub"
          />
        </div>
        <div class="form-description">
          <span>一个使用 Canvas 渲染游戏王卡片的工具</span>
        </div>
      </div>

      <div class="form-main">
        <el-form :model="form" label-width="auto">
          <el-form-item label="卡片">
            <el-select
              v-model="form.card"
              placeholder="请选择卡片"
              @change="changeCard"
            >
              <el-option label="游戏王" value="yugioh" />
              <el-option label="超速决斗" value="rush-duel" />
              <el-option label="游戏王卡背" value="yugioh-back" />
              <el-option label="场地中心卡" value="field-center" />
              <el-option label="游戏王 2 期" value="yugioh-series-2" />
            </el-select>
          </el-form-item>
          <template v-if="form.card === 'yugioh'">
            <el-form-item label="外框覆盖前景图">
              <el-switch
                :model-value="frameOptions.cardBorderCoverForeground"
                @change="setFrameOption('cardBorderCoverForeground', $event)"
              />
            </el-form-item>
            <template v-if="frameOptions.showStars">
              <el-form-item label="等级/阶级对齐">
                <el-radio-group
                  :model-value="frameOptions.levelAlign"
                  @change="setFrameOption('levelAlign', $event)"
                >
                  <el-radio-button value="left">左</el-radio-button>
                  <el-radio-button value="center">中</el-radio-button>
                  <el-radio-button value="right">右</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="星星样式">
                <el-select
                  :model-value="frameOptions.levelStyle"
                  @change="setFrameOption('levelStyle', $event)"
                >
                  <el-option label="等级" value="level" />
                  <el-option label="阶级" value="rank" />
                  <el-option label="等级（大师）" value="level-grandmaster" />
                </el-select>
              </el-form-item>
            </template>
          </template>
          <el-form-item label="数据">
            <json-editor-vue
              v-model="jsonData"
              style="width: 100%"
              mode="text"
              v-bind="jsonOption"
            />
          </el-form-item>
        </el-form>

        <div class="button-group">
          <el-button type="primary" @click="exportImage">导出图片</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { FieldCenterCard, resolveFrameOptions, RushDuelCard, YugiohBackCard, YugiohCard, YugiohSeries2Card } from 'yugioh-card-ts';
import JsonEditorVue from 'json-editor-vue';
import fieldCenterDemo from '@/assets/demo/field-center-demo';
import rushDuelDemo from '@/assets/demo/rush-duel-demo';
import yugiohBackDemo from '@/assets/demo/yugioh-back-demo';
import yugiohDemo from '@/assets/demo/yugioh-demo';
import yugiohSeries2Demo from '@/assets/demo/yugioh-series-2-demo';

const card = ref(null);
const cardLeaf = shallowRef(null);
const form = reactive({
  card: 'yugioh',
  data: {},
});
const jsonData = ref('');
const frameOptions = computed(() => resolveFrameOptions(form.data));
const setFrameOption = (key, value) => {
  jsonData.value = { ...form.data, [key]: value };
};
const jsonOption = reactive({
  mainMenuBar: false,
  statusBar: false,
});

onMounted(() => {
  changeCard();
});

onBeforeUnmount(() => {
  cardLeaf.value?.leafer.destroy();
});

const changeCard = () => {
  cardLeaf.value?.leafer.destroy();
  let Card;
  switch (form.card) {
    case 'yugioh':
      form.data = yugiohDemo;
      Card = YugiohCard;
      break;
    case 'rush-duel':
      form.data = rushDuelDemo;
      Card = RushDuelCard;
      break;
    case 'yugioh-back':
      form.data = yugiohBackDemo;
      Card = YugiohBackCard;
      break;
    case 'field-center':
      form.data = fieldCenterDemo;
      Card = FieldCenterCard;
      break;
    case 'yugioh-series-2':
      form.data = yugiohSeries2Demo;
      Card = YugiohSeries2Card;
      break;
    default:
      form.data = yugiohDemo;
      Card = YugiohCard;
  }
  cardLeaf.value = new Card({
    view: card.value,
    data: form.data,
    resourcePath: process.env.NODE_ENV === 'production' ? 'https://raw.githubusercontent.com/kkr223/yugioh-card-ts/refs/heads/master/src/assets/yugioh-card' : 'src/assets/yugioh-card',
  });
  jsonData.value = form.data;
};

const exportImage = () => {
  cardLeaf.value.leafer.export('卡片.png', {
    screenshot: true,
    pixelRatio: devicePixelRatio,
  });
};

watch(() => jsonData.value, () => {
  try {
    const data = typeof jsonData.value === 'string' ? JSON.parse(jsonData.value) : jsonData.value;
    if (!data || typeof data !== 'object' || Array.isArray(data)) return;
    form.data = data;
    cardLeaf.value.setData(form.card === 'yugioh' ? {
      cardBorderCoverForeground: 'auto', levelAlign: 'auto', levelStyle: 'auto', ...data,
    } : data);
  } catch {

  }
});

const toGithub = () => {
  open('https://github.com/kkr223/yugioh-card-ts');
};
</script>

<style lang="scss" scoped>
.yugioh-card-container {
  height: 100vh;
  display: flex;
  overflow: hidden;

  .yugioh-card {
    height: 100%;
    overflow: auto;
    flex-grow: 1;
    position: relative;
    padding: 20px;

    .card {
      display: inline-block;
      vertical-align: top;
    }
  }

  .form {
    height: 100%;
    overflow: auto;
    width: 600px;
    flex-shrink: 0;
    border-left: 1px solid var(--border-color);

    .form-header {
      padding: 30px 20px;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid var(--border-color);

      .form-title {
        display: flex;
        flex-wrap: wrap;
        align-items: center;

        .github-icon {
          margin-left: 5px;
          cursor: pointer;
        }
      }

      .form-description {
        margin-top: 20px;
        font-size: 12px;
        font-weight: normal;
        color: var(--info-color);
      }
    }

    .form-main {
      padding: 20px;

      .button-group {
        margin-top: 20px;

        .el-button {
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: 800px) {
  .yugioh-card-container {
    height: auto;
    min-height: 100vh;
    display: block;
    overflow: visible;

    .yugioh-card {
      height: auto;
      max-height: 65vh;
    }

    .form {
      width: 100%;
      height: auto;
      border-left: 0;
      border-top: 1px solid var(--border-color);
    }
  }
}
</style>
