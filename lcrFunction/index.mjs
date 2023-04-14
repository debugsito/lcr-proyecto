export const handler = async(x) => {
    let input = x.data.split(' ');
    let n = parseInt(input[0]);
    //let n = x.number;
    let game = 1;
    
    if (n === 0) {
        const response = {
            statusCode: 200,
            body: JSON.stringify([]),
        };
        return response;
    }
    let array_output = [];
    array_output.push(`Game ${game++}: `);
    let rolls = input[1];
    //let rolls = x.data;
    let players = new Array(n).fill(3);
    let roll_idx = 0;
    let winner = -1;
    let num_players_with_chips = 0;
    let center = 0;
    let player_idx = 0;

    while (true) {

        num_players_with_chips = 0;
        for (let i = 0; i < n; i++) {
            if (players[i] > 0) {
                num_players_with_chips++;
                winner = i;
            }
        }

        if (num_players_with_chips === 1) {
            break;
        }

        if (players[player_idx] == 0) {
            player_idx = (player_idx + 1) % n;
            continue;
        }

        let num_dice = Math.min(3, players[player_idx]);
        if (num_dice + roll_idx > rolls.length) {
            break;
        }
        let l_count = 0;
        let r_count = 0;
        let c_count = 0;
        for (let i = roll_idx; i < roll_idx + num_dice; i++) {

            if (rolls[i] == 'L') {
                l_count++;
            }
            else if (rolls[i] == 'R') {
                r_count++;
            }
            else if (rolls[i] == 'C') {
                c_count++;
            }
        }
        roll_idx += num_dice;
        players[player_idx] -= l_count + r_count + c_count;
        for (let i = 0; i < l_count; i++) {
            players[(player_idx + 1) % n]++;
        }
        for (let i = 0; i < r_count; i++) {
            players[(player_idx - 1 + n) % n]++;
        }
        center += c_count;
        player_idx = (player_idx + 1) % n;
    }

    for (let i = 0; i < n; i++) {
        let text = `Player ${i + 1}:${players[i]}`;

        if (i == winner && num_players_with_chips == 1) {
            text += "(W)";
        }
        else if (i == player_idx) {
            text += "(*)"
        }
        array_output.push(text);
    }
    array_output.push(`Center:${center}`);
    const response = {
        statusCode: 200,
        result: array_output,
    };
    return response;
};

