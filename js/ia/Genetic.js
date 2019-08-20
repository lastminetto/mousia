function Genetic() {

    this.fitness = 0;
    this.generation = 1;

    this.networks = [];

};

Genetic.prototype.createNetwork = function (count, inputsNeorons, hiddenNeorons, outputs) {

    this.networkCount = count;

    for (let i = 0; i < this.networkCount; i++) {

        let network = new synaptic.Architect.Perceptron(inputsNeorons, hiddenNeorons, hiddenNeorons, outputs);
        network.fitness = 0;

        this.networks.push(network);
    }
};

Genetic.prototype.crossOverNetworks = function (alreadyEnds) {

    this.generation++;

    let toSplice = alreadyEnds ? this.networkCount / 2 : 5;

    this.networks = this.networks.sort(function (a, b) {
        return b.fitness - a.fitness;
    }).splice(0, toSplice);

    var bestNetworks = JSON.parse(JSON.stringify(this.networks));

    let toMutate = alreadyEnds ? this.networkCount : 5;

    for (let i = 0; i < toMutate; i++) {

        var netA = bestNetworks[Math.floor(Math.random() * bestNetworks.length)];
        var netB = bestNetworks[Math.floor(Math.random() * bestNetworks.length)];

        var crossOverNetwork = this.crossOver(netA, netB);
        var newNetwork = this.mutate(crossOverNetwork);

        this.networks.push(synaptic.Network.fromJSON(newNetwork));
    }

    for (let i = this.networks.length; i < this.networkCount; i++) {
        var net = bestNetworks[Math.floor(Math.random() * bestNetworks.length)];

        var newNetwork = this.mutate(net);

        this.networks.push(synaptic.Network.fromJSON(newNetwork));
    }
};

Genetic.prototype.mutateDataKeys = function (a, key, mutationRate) {

    for (var k = 0; k < a.length; k++) {

        if (Math.random() > mutationRate)
            continue;

        a[k][key] += a[k][key] * (Math.random() - 0.5) * 3 + (Math.random() - 0.5);
    }
}

Genetic.prototype.mutate = function (network) {

    this.mutateDataKeys(network.neurons, 'bias', 0.3);

    this.mutateDataKeys(network.connections, 'weight', 0.3);

    return network;

}

Genetic.prototype.crossOverDataKey = function (a, b, key) {

    var cutLocation = Math.round(a.length * Math.random());

    var tmp;
    for (var k = cutLocation; k < a.length; k++) {
        // Swap
        tmp = a[k][key];
        a[k][key] = b[k][key];
        b[k][key] = tmp;
    }
}

Genetic.prototype.crossOver = function (networkA, networkB) {

    if (Math.random() > 0.5) {
        var tmp = networkA;
        networkA = networkB;
        networkB = tmp;
    }

    networkA = JSON.parse(JSON.stringify(networkA));
    networkB = JSON.parse(JSON.stringify(networkB));

    this.crossOverDataKey(networkA.neurons, networkB.neurons, 'bias');

    return networkA;
}

Genetic.prototype.executeNetwork = function (index, score) {

    if (!this.networks[index].fitness || this.networks[index].fitness < score)
        this.networks[index].fitness = score;

    if (score > this.fitness)
        this.fitness = score;
};

Genetic.prototype.activateNetwork = function (index, input) {
    return this.networks[index].activate(input);
};