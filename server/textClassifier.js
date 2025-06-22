const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

class TextClassifier {
  constructor() {
    this.model = null;
    this.useModel = null;
  }

  async init() {
    this.useModel = await use.load();
  }

  async embedTexts(texts) {
    return await this.useModel.embed(texts);
  }

  createModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ inputShape: [512], units: 256, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.2 }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy'],
    });
    this.model = model;
  }

  // Обучение модели
  async train(texts, labels, epochs = 20) {
    const xs = await this.embedTexts(texts);
    const ys = tf.tensor(labels);

    this.createModel();

    await this.model.fit(xs, ys, {
      epochs,
      shuffle: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, accuracy=${logs.acc.toFixed(4)}`);
        },
      },
    });

    xs.dispose();
    ys.dispose();
  }

  // Предсказание
  async predict(text) {
  const xs = await this.embedTexts([text]);

  const prediction = await this.model.predict(xs); 
  const predictionData = await prediction.data();
  const score = predictionData[0];

  console.log('>>> predict() score =', score);

  xs.dispose();
  prediction.dispose();

  return score;
}
}

module.exports = TextClassifier;
