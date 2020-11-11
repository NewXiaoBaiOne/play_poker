// 生成牌面HTML代码的函数
function makePoker(poker){
    // {num:1 ,color: 3}
    // 普通花色的坐标数据
    let color = [
        {x:-17, y:-222},       // 方块花色的坐标
        {x:-17, y:-8},       // 梅花花色的坐标
        {x:-163, y:-8},       // 红桃花色的坐标
        {x:-163, y:-222},       // 黑桃花色的坐标
    ];
    let x,y;

    if(poker.num != 14){
        x = color[poker.color].x
        y = color[poker.color].y
    }else{
        if(poker.color == 0){
            x = -163;
            y = -8;
        }else{
            x = -17;
            y = -8;
        }
    }
    
    return '<li data-num="'+poker.num+'" data-color="'+poker.color+'" style="width: 125px; height: 175px; background: url(./images/'+poker.num+'.png) '+x+'px '+y+'px;"></li>';
}

// 牌组数据排序函数
function sortPoker(poker_data) {

    poker_data.sort((x, y)=>{
        if(x.num != y.num){
            return x.num-y.num      // 如果点不同的话就按点数来排序
        }else{
            return x.color-y.color  // 如果点相同的话就按花色来的排序
        }
    });

    //return poker_data;
}

// 检查牌组的函数
/* 
    牌型分类：
    1       单张
    2       对子
    3       三张
    4       普炸
    5       三带一
    6       顺子
    7       三带二
    8       连对
    9       四带二
    10      四带两对
    777     飞机
    888     王炸
*/
function checkPoker(data) {
    // 为了方便牌型判断需要先把选中的牌组数据进行排序
    sortPoker(data.poker);

    let length = data.poker.length;       // 用于分析牌组的张数

    switch (length) {
        // 判断一张牌的情况
        case 1:
            data.type = 1;          // 设置当前选择牌的牌型
            // 判断是否为大小王
            if(data.poker[0].num == 14){
                if(data.poker[0].color == 0){
                    data.max = 14;
                }else{
                    data.max = 15;
                }
            }else{
                data.max = data.poker[0].num;
            }

            return true;        // 符合规则返回true
            break;

        // 判断两张牌的情况
        case 2:
            if(data.poker[0].num != data.poker[1].num){
                return false;
            }else{
                // 判断是否为王炸
                if(data.poker[0].num == 14){
                    data.type = 666;        // 设置牌型为王炸
                    data.max  = 14;
                }else{
                    data.type = 2;          // 设置型为对子
                    data.max = data.poker[0].num;
                }
                return true;
            }
            break;

        // 判断三张牌的情况
        case 3:
            if(data.poker[0].num == data.poker[2].num ){
                data.type = 3;      // 设置牌型为3张
                data.max = data.poker[0].num;   // 设置牌型的判断值
                return true;
            }
            return false;
            break;

        // 判断四张牌的情况
        case 4:
            if(data.poker[0].num == data.poker[3].num ){
                data.type = 4;      // 设置牌型为普通炸弹
                data.max = data.poker[0].num;   // 设置牌型的判断值
                return true;
            }else if(data.poker[0].num == data.poker[2].num || data.poker[1].num == data.poker[3].num){
                data.type = 5;      // 设置牌型为三带一
                data.max = data.poker[1].num;   // 设置牌型的判断值
                return true;
            }
            return false;
            break;

        // 判断五张牌的情况
        case 5:
            // 先判断是否为顺子
            if(checkStraight(data.poker)){
                data.type = 6;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            // 判断是否为三带二
            if(data.poker[0].num == data.poker[2].num && data.poker[3].num == data.poker[4].num ||
                data.poker[0].num == data.poker[1].num && data.poker[2].num == data.poker[4].num
            ){
                data.type = 7;      // 设置牌型为顺子
                data.max = data.poker[2].num;   // 设置牌型的判断值
                return true;
            }
            return false;
            break;

        // 判断六张牌的情况
        case 6:
            // 先判断是否为顺子
            if(checkStraight(data.poker)){
                data.type = 6;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            // 判断是否为连对
            if(checkDouble(data.poker)){
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            // 判断是否为四带二
            if(data.poker[0].num == data.poker[3].num || 
                data.poker[1].num == data.poker[4].num || 
                data.poker[2].num == data.poker[5].num
                ){
                data.type = 9;      // 设置牌型为四带二
                data.max = data.poker[2].num;   // 设置牌型的判断值
                return true;
            }

            // 判断是否为飞机
            if(data.poker[0].num == data.poker[2].num && 
                data.poker[3].num == data.poker[5].num && 
                data.poker[0].num*1+1 == data.poker[3].num
                ){
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[5].num;   // 设置牌型的判断值
                return true;
            }
            return false;
            break;
        
        // 七张牌的情况
        case 7:
            // 先判断是否为顺子
            if(checkStraight(data.poker)){
                data.type = 6;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            return false;
            break;
        
        // 八张牌的情况
        case 8:
            // 先判断是否为顺子
            if(checkStraight(data.poker)){
                data.type = 6;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            // 判断是否为连对
            if(checkDouble(data.poker)){
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length-1].num;   // 设置牌型的判断值
                return true;
            }

            /* 
                八张牌的飞机可能性
                33344456
                34555666
                33334446
                34445556
            */
            // 判断是否为飞机
            if(data.poker[0].num == data.poker[2].num && 
                data.poker[3].num == data.poker[5].num && 
                data.poker[0].num*1+1 == data.poker[3].num ||   // 判断前6张牌是否连续

                data.poker[2].num == data.poker[4].num && 
                data.poker[5].num == data.poker[7].num && 
                data.poker[2].num*1+1 == data.poker[5].num ||    // 判断后6张牌是否连续

                data.poker[1].num == data.poker[3].num && 
                data.poker[4].num == data.poker[6].num && 
                data.poker[1].num*1+1 == data.poker[4].num   // 判断中间6张牌是否连续
            ){
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[5].num;   // 设置牌型的判断值
                return true;
            }
            
            // 判断四带两对
            /* 
                44445566
                44555566
                44556666
            */
            if( data.poker[0].num == data.poker[3].num &&
                data.poker[4].num == data.poker[5].num &&
                data.poker[6].num == data.poker[7].num      // 判断前四张
            ){
                data.type = 10;      // 设置牌型为四带两对
                data.max = data.poker[0].num;   // 设置牌型的判断值
            }

            if( data.poker[2].num == data.poker[5].num &&
                data.poker[0].num == data.poker[1].num &&
                data.poker[6].num == data.poker[7].num      // 判断中间四张
            ){
                data.type = 10;      // 设置牌型为四带两对
                data.max = data.poker[2].num;   // 设置牌型的判断值
            }

            if( data.poker[4].num == data.poker[7].num &&
                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num        // 判断后四张
            ){
                data.type = 10;      // 设置牌型为四带两对
                data.max = data.poker[7].num;   // 设置牌型的判断值
            }

            return false;
            break;

        default:
            break;
    }

}

// 检查当前牌型是否为顺子
function checkStraight(poker) {
    for(let i=0; i<poker.length-1; i++){
        if(poker[i].num*1 + 1 != poker[i+1].num){
            return false;
        }
    }

    return true;
}

// 检查当前牌型是否为连对
function checkDouble(poker){
   //  33445566
    for(let i=0; i<poker.length-2; i += 2){
        if(poker[i].num != poker[i+1].num || poker[i].num*1 + 1 != poker[i+2].num){
            return false;
        }
    }
    return true;
}

// 检查当前手牌是否大于桌上的牌的函数
function checkVS(){
    // 如果桌面上没有牌的话可以直接打出
    if(gameData.desktop.type == 0){
        return true;
    }

    // 如果出的牌是王炸的话可以直接打出
    if(gameData.select.type == 888){
        return true;
    }

    // 出的是普通炸弹并且桌上的不是炸弹或者王炸就可以直接打出
    if(gameData.select.type == 4 && (gameData.desktop.type != 4 && gameData.desktop.type != 888)){
        return true;
    }

    // 如果桌面上的牌是王炸那无论是什么牌都不能打出
    if(gameData.desktop.type == 888){
        return false;
    }

    // 一般组数据大小的判断
    if( gameData.select.type == gameData.desktop.type && 
        gameData.select.poker.length == gameData.desktop.poker.length &&
        gameData.select.max > gameData.desktop.max
    ){
        return true;
    }else{
        return false;
    }
}
